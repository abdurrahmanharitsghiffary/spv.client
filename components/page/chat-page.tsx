"use client";

import { useSocket } from "@/hooks/use-socket";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { RefObject, useCallback, useEffect, useState } from "react";
import ChatBubble from "../chat/chat-bubble";
import { useSession } from "@/stores/auth-store";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { useGetMessagesByRoomId } from "@/lib/api/messages/query";
import { Chat } from "@/types/chat";
import { ApiPagingObjectResponse } from "@/types/response";
import TypingAnimation from "../typing-animation";
import { Button } from "@nextui-org/button";
import { Badge } from "@nextui-org/badge";
import { BiChevronDown } from "react-icons/bi";
import { useObserver } from "@/hooks/use-observer";

type InfiniteChatPaging = InfiniteData<ApiPagingObjectResponse<Chat[]>>;

export default function ChatPage() {
  const { chatId } = useParams();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { messages, isFetchedAfterMount, error, isError } =
    useGetMessagesByRoomId(Number(chatId));
  const [newReceivedMessages, setNewReceivedMessages] = useState<{
    firstReceivedMessageId: number | null;
    count: number;
  }>({ count: 0, firstReceivedMessageId: null });
  console.log(newReceivedMessages, "New Received Messages");
  const [typingId, setTypingId] = useState<number | null>(null);
  const [ref, setRef] = useState<RefObject<HTMLDivElement | null>>({
    current: null,
  });
  const refCb = useCallback((node: HTMLDivElement) => {
    setRef({ current: node });
  }, []);
  const session = useSession();
  const isInView = useObserver(ref, { threshold: 0.5 });
  console.log(isInView, "IsInView");
  const isSelfTyped = messages?.data?.[0]?.author?.id === session?.id;

  useEffect(() => {
    if (messages?.data?.length && isSelfTyped)
      document.body.scrollIntoView(false);
  }, [messages?.data?.length, isSelfTyped]);

  useNotFoundRedirect(
    error,
    isError,
    (error as any)?.statusCode === 403,
    "/chats"
  );

  useEffect(() => {
    if (isFetchedAfterMount) {
      document.body.scrollIntoView(false);
    }
  }, [isFetchedAfterMount]);

  useEffect(() => {
    if (isInView)
      setNewReceivedMessages((c) => ({
        ...c,
        firstReceivedMessageId: null,
        count: 0,
      }));
  }, [isInView]);

  useEffect(() => {
    if (newReceivedMessages.firstReceivedMessageId === null) {
      setRef({ current: null });
    }
  }, [newReceivedMessages]);

  console.log(socket?.active, "active socket");
  const handleVisitRoom = useCallback(() => {
    if (!socket) return;
    if (socket.connected) socket.emit(Socket_Event.VISIT_ROOM, Number(chatId));
  }, [socket, chatId]);

  useEffect(() => {
    console.log("EMITTED");
    handleVisitRoom();
  }, [handleVisitRoom]);

  const readMessageAfterMount = useCallback(() => {
    messages.data?.forEach((message) => {
      const readedMessage = message.readedBy?.filter(
        (r) => r.id === session?.id
      );
      if ((readedMessage?.length ?? 0) > 0 || !socket) return null;
      socket.emit(Socket_Event.READ_MESSAGE, {
        userId: session?.id,
        chatId: message.id,
      });
    });
  }, [messages.data, session?.id, socket]);

  useEffect(() => {
    readMessageAfterMount();
  }, [readMessageAfterMount]);

  const onTyping = (data: any) => {
    setTypingId(data.userId);
  };

  const onTypingEnd = (data: any) => {
    setTypingId(null);
  };

  const onReadMessage = async (data: { chatId: number; roomId: number }) => {
    queryClient.invalidateQueries({
      queryKey: keys.chatByRoomId(Number(data.roomId)),
    });
  };

  const onReceiveMessage = async (createdMessage: Chat) => {
    queryClient.setQueriesData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page, i) => {
            if (!page) return page;
            if (i === oldData.pages.length - 1) {
              return {
                ...page,
                data: [createdMessage, ...page.data],
                pagination: {
                  ...page.pagination,
                  total_records: (page.pagination.total_records += 1),
                  result_count: (page.pagination.result_count += 1),
                },
              };
            }
            return page;
          }),
        };
      }
    );
    console.log(session?.id, "Session ID");
    console.log(createdMessage.author.id, "CreatedMessage Id");
    if (session?.id !== createdMessage.author.id) {
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
  };

  const onDeleteMessage = async (deletedChat: number) => {
    queryClient.setQueryData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((p) => {
            if (!p) return p;
            return {
              ...p,
              data: p.data.filter((c) => c.id !== deletedChat),
              pagination: {
                ...p.pagination,
                total_records: (p.pagination.total_records -= 1),
                result_count: (p.pagination.result_count -= 1),
              },
            };
          }),
        };
      }
    );
  };

  const onUpdateMessage = async (updatedMessage: Chat) => {
    queryClient.setQueryData<InfiniteChatPaging>(
      keys.messagebyRoomId(Number(chatId)),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((p) => {
            if (!p) return p;
            return {
              ...p,
              data: p.data.map((c) => {
                if (c.id === updatedMessage.id) {
                  return { ...updatedMessage };
                }
                return c;
              }),
            };
          }),
        };
      }
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.READED_MESSAGE, onReadMessage);
    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    socket.on(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
    socket.on(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
    socket.on(Socket_Event.USER_TYPING, onTyping);
    socket.on(Socket_Event.USER_TYPING_END, onTypingEnd);
    return () => {
      socket.off(Socket_Event.READED_MESSAGE, onReadMessage);
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
      socket.off(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
      socket.off(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
      socket.off(Socket_Event.USER_TYPING, onTyping);
      socket.off(Socket_Event.USER_TYPING_END, onTypingEnd);
    };
  }, [socket]);

  return (
    <>
      {(messages?.data ?? [])
        .slice()
        .reverse()
        .map((chat) => (
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
        <Badge content={newReceivedMessages.count} color="danger" size="sm">
          <Button
            size="sm"
            onClick={() => document.body.scrollIntoView(false)}
            color="primary"
            radius="full"
            isIconOnly
          >
            <BiChevronDown size={18} />
          </Button>
        </Badge>
      </div>

      {typingId && typingId !== session?.id && <TypingAnimation />}
    </>
  );
}
