"use client";

import { useSocket } from "@/hooks/use-socket";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import ChatBubble from "../chat/chat-bubble";
import { useSession } from "@/stores/auth-store";
import { useGetMessagesByRoomId } from "@/lib/api/chats/query";

export default function ChatPage() {
  const { chatId } = useParams();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const {
    messages,
    isSuccess,
    isFetching,
    isFetchedAfterMount,
    isLoading,
    isRefetching,
  } = useGetMessagesByRoomId(Number(chatId));

  const session = useSession();
  console.log(isSuccess, "is Successs");
  console.log(isFetching, "is Fetching");
  console.log(isLoading, "is Loading");

  useEffect(() => {
    if (!isRefetching) {
      document.body.scrollIntoView(false);
    }
  }, [isRefetching]);

  useEffect(() => {
    if (isFetchedAfterMount) {
      document.body.scrollIntoView(false);
    }
  }, [isFetchedAfterMount]);
  const readMessageAfterMount = useCallback(() => {
    messages.data?.forEach((message) => {
      const readedMessage = message.readedBy?.filter(
        (r) => r.id === session?.id
      );
      console.log(readedMessage);
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

  const onReadMessage = async (data: { chatId: number; roomId: number }) => {
    queryClient.invalidateQueries({
      queryKey: keys.chatByRoomId(Number(data.roomId)),
    });
  };

  const onReceiveMessage = async (createdMessage: any) => {
    console.log(createdMessage, "REceived message");
    queryClient.invalidateQueries({
      queryKey: keys.chatByRoomId(Number(chatId)),
    });
    queryClient.invalidateQueries({
      queryKey: keys.messagebyRoomId(Number(chatId)),
    });
    queryClient.invalidateQueries({
      queryKey: keys.meChats(),
    });
  };

  const onDeleteMessage = async (deletedChat: any) => {
    // queryClient.setQueryData(
    //   keys.chatByRecipientId(deletedChat?.recipientId),
    //   (old: any) => ({
    //     ...old,
    //     data: (old?.data ?? []).filter(
    //       (chat: any) => chat.id !== deletedChat?.id
    //     ),
    //   })
    // );
  };

  const onUpdateMessage = async (updatedMessage: any) => {
    // queryClient.setQueryData(
    //   keys.chatByRecipientId(updatedMessage?.recipientId),
    //   (old: any) => ({
    //     ...old,
    //     data: (old?.data ?? []).map((chat: any) => {
    //       if (chat?.id === updatedMessage?.id) {
    //         return updatedMessage;
    //       }
    //       return chat;
    //     }),
    //   })
    // );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.READED_MESSAGE, onReadMessage);
    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    socket.on(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
    socket.on(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
    return () => {
      socket.off(Socket_Event.READED_MESSAGE, onReadMessage);
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
      socket.off(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
      socket.off(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
    };
  }, [socket]);

  return (
    <>
      {(messages?.data ?? [])
        .slice()
        .reverse()
        .map((chat) => (
          <ChatBubble
            date={chat?.createdAt}
            text={chat?.message ?? ""}
            key={chat?.id}
            images={chat?.attachments as any}
            isRecipient={chat?.author?.id !== session?.id}
          />
        ))}
    </>
  );
}
