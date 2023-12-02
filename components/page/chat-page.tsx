"use client";

import { useSocket } from "@/hooks/use-socket";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import ChatBubble from "../chat/chat-bubble";
import { useSession } from "@/stores/auth-store";
import {
  useGetChatRoomById,
  useGetMessagesByRoomId,
} from "@/lib/api/chats/query";

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

    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    socket.on(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
    socket.on(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
    return () => {
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
      socket.off(Socket_Event.DELETE_MESSAGE, onDeleteMessage);
      socket.off(Socket_Event.UPDATE_MESSAGE, onUpdateMessage);
    };
  }, [socket]);

  return (
    <div
      className="pt-5 flex flex-col gap-5 px-4 w-full pb-20"
      // style={{
      //   backgroundSize: "100%",
      //   backgroundImage:
      //     "url('https://images.unsplash.com/photo-1695606392987-9635caaf7f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
      // }}
    >
      {(messages?.data ?? [])
        .slice()
        .reverse()
        .map((chat) => (
          <ChatBubble
            date={chat?.createdAt}
            text={chat?.message ?? ""}
            key={chat?.id}
            image={chat?.attachments?.src}
            isRecipient={chat?.author?.id !== session?.id}
          />
        ))}
    </div>
  );
}
