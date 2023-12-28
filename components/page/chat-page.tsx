"use client";

import { useSocket } from "@/hooks/use-socket";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ChatBubble from "../chat/chat-bubble";
import { useSession } from "@/stores/auth-store";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { useGetMessagesByRoomId } from "@/lib/api/messages/query";
import { Chat, UserChatRead } from "@/types/chat";
import { ApiPagingObjectResponse } from "@/types/response";
import TypingAnimation from "../typing-animation";
import { Button } from "@nextui-org/button";
import { Badge } from "@nextui-org/badge";
import { BiChevronDown } from "react-icons/bi";
import { useObserver } from "@/hooks/use-observer";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";
import {
  deletePagingData,
  prependPagingData,
  updatePagingData,
} from "@/lib/api/utils";
import { TypingUser, TypingUserV2 } from "@/types";

type InfiniteChatPaging = InfiniteData<ApiPagingObjectResponse<Chat[]>>;

export default function ChatPage() {
  const { chatId } = useParams();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [isSelfTyped, setIsSelfTyped] = useState(false);
  const {
    messages: resp,
    isFetchedAfterMount,
    error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
  } = useGetMessagesByRoomId(Number(chatId));
  const { ref: fetcherRef } = useFetchNextPageObserver({
    isDisabled: !hasNextPage && isSuccess === false && !isFetching,
    fetchNextPage,
    isFetching,
  });

  const [newReceivedMessages, setNewReceivedMessages] = useState<{
    firstReceivedMessageId: number | null;
    count: number;
  }>({ count: 0, firstReceivedMessageId: null });
  const messages = useMemo(() => resp?.data?.slice().reverse() ?? [], [resp]);
  const [typingUser, setTypingUser] = useState<TypingUser>(null);
  const [ref, setRef] = useState<RefObject<HTMLDivElement | null>>({
    current: null,
  });

  const refCb = useCallback((node: HTMLDivElement) => {
    setRef({ current: node });
  }, []);

  const session = useSession();
  const isInView = useObserver(ref, { threshold: 0.5 });

  const reset = useCallback(() => {
    setNewReceivedMessages((c) => ({
      ...c,
      firstReceivedMessageId: null,
      count: 0,
    }));
  }, []);

  useEffect(() => {
    if (isFetchedAfterMount) {
      document.body.scrollIntoView(false);
    }
  }, [isFetchedAfterMount]);

  useEffect(() => {
    if (isInView) reset();
  }, [isInView]);

  useEffect(() => {
    if (chatId) reset();
  }, [chatId]);

  useEffect(() => {
    if (newReceivedMessages.firstReceivedMessageId === null) {
      setRef({ current: null });
    }
  }, [newReceivedMessages]);

  const handleVisitRoom = useCallback(() => {
    if (!socket) return;
    if (socket.connected) socket.emit(Socket_Event.VISIT_ROOM, Number(chatId));
  }, [socket, chatId]);

  const handleLeaveRoom = useCallback(() => {
    if (!socket) return;
    if (socket.connected)
      socket.emit(Socket_Event.UNVISIT_ROOM, Number(chatId));
  }, [socket, chatId]);

  useEffect(() => {
    handleVisitRoom();
    return () => {
      handleLeaveRoom();
    };
  }, [handleVisitRoom, handleLeaveRoom]);

  const readMessageAfterMount = useCallback(() => {
    const unreadedMessages = messages?.filter(
      (message) =>
        message.author.id !== session?.id &&
        !message?.readedBy?.some((r) => r.id === session?.id)
    );
    console.log(unreadedMessages, "Unreaded messages");
    unreadedMessages?.forEach((message) => {
      if (!socket || message.roomId !== Number(chatId)) return null;
      socket.emit(Socket_Event.READ_MESSAGE, {
        userId: session?.id,
        chatId: message.id,
        roomId: message.roomId,
      });
    });
  }, [messages, session?.id, socket]);

  useEffect(() => {
    readMessageAfterMount();
  }, [readMessageAfterMount]);

  useEffect(() => {
    if (isSelfTyped) {
      document.body.scrollIntoView(false);
      setIsSelfTyped(false);
    }
  }, [isSelfTyped]);

  const onReceiveMessage = async (createdMessage: Chat) => {
    if (createdMessage.roomId !== Number(chatId)) return null;
    queryClient.setQueriesData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => prependPagingData(oldData, createdMessage)
    );

    if (
      session?.id !== createdMessage.author.id &&
      createdMessage.roomId === Number(chatId)
    ) {
      setNewReceivedMessages((c) => {
        if (c.firstReceivedMessageId !== null) {
          return { ...c, count: c.count + 1 };
        }
        return {
          ...c,
          firstReceivedMessageId: createdMessage.id,
          count: c.count + 1,
        };
      });
    }

    setIsSelfTyped(session?.id === createdMessage.author.id);
  };

  const onTyping = (data: TypingUserV2) => {
    setTypingUser(data);
  };

  const onTypingEnd = (data: TypingUserV2) => {
    setTypingUser(null);
  };

  const onDeleteMessage = async (data: { chatId: number; roomId: number }) => {
    if (data.roomId !== Number(chatId)) return null;

    queryClient.setQueriesData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => deletePagingData(oldData, data.chatId, "id")
    );
  };

  const onUpdateMessage = async (updatedMessage: Chat) => {
    if (updatedMessage.roomId !== Number(chatId)) return null;

    queryClient.setQueriesData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => updatePagingData(oldData, updatedMessage, "id")
    );
  };

  const onReadedMessage = async (
    data: UserChatRead & { roomId: number; chatId: number }
  ) => {
    if (data.roomId !== Number(chatId)) return null;
    queryClient.setQueriesData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => {
        const { roomId, chatId, ...rest } = data;
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: (oldData?.pages ?? []).map((p) => {
            if (!p) return p;
            return {
              ...p,
              data: (p?.data ?? []).map((chat) => {
                if (chat.id === chatId) {
                  return {
                    ...chat,
                    readedBy: [...(chat?.readedBy ?? []), { ...rest }],
                  };
                }
                return chat;
              }),
            };
          }),
        };
      }
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.READED_MESSAGE, onReadedMessage);
    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    socket.on(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
    socket.on(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
    socket.on(Socket_Event.USER_TYPING, onTyping);
    socket.on(Socket_Event.USER_TYPING_END, onTypingEnd);
    return () => {
      socket.off(Socket_Event.READED_MESSAGE, onReadedMessage);
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
      socket.off(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
      socket.off(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
      socket.off(Socket_Event.USER_TYPING, onTyping);
      socket.off(Socket_Event.USER_TYPING_END, onTypingEnd);
    };
  }, [socket]);

  if ((error as any)?.statusCode === 404) {
    return (
      <div className="flex justify-center flex-col gap-2 items-center h-full w-full m-auto">
        <span className="text-foreground">Chat room not found</span>
      </div>
    );
  }

  const isShowTypingAnimation =
    typingUser &&
    typingUser.userId !== session?.id &&
    typingUser.chatId === Number(chatId);

  return (
    <>
      {isFetchingNextPage && <Spinner className="my-4 mx-auto" />}
      <div ref={fetcherRef}></div>
      {messages.map((chat) => (
        <ChatBubble
          key={chat?.id}
          ref={
            newReceivedMessages?.firstReceivedMessageId === chat?.id
              ? refCb
              : undefined
          }
          chat={chat}
          isRecipient={chat.author.id !== session?.id}
        />
      ))}
      <div
        className="fixed bottom-20 right-4 z-20"
        style={{
          scale: newReceivedMessages.count > 0 && !isInView ? 1 : 0,
          transition: "ease-in-out .3s",
        }}
      >
        <Badge content={newReceivedMessages.count} color="danger">
          <Button
            onClick={() => document.body.scrollIntoView(false)}
            color="primary"
            radius="full"
            isIconOnly
          >
            <BiChevronDown size={18} />
          </Button>
        </Badge>
      </div>

      {isShowTypingAnimation && <TypingAnimation />}
    </>
  );
}
