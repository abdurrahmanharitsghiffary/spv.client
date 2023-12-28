"use client";

import BackButton from "@/components/button/back-button";
import ChatMenuTrigger from "@/components/menu/chat-menu/trigger";
import { TypographyLarge, TypographyMuted } from "@/components/ui/typography";
import { useSocket } from "@/hooks/use-socket";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import { TypingUser } from "@/types";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import { Skeleton } from "@nextui-org/skeleton";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";

export default function ChatHeader({ router }: { router: AppRouterInstance }) {
  const { chatId } = useParams();
  const socket = useSocket();
  const [typingUser, setTypingUser] = useState<TypingUser>(null);
  const session = useSession();
  const { chatRoom, isLoading, isSuccess, isError } = useGetChatRoomById(
    Number(chatId)
  );

  const onUserTyping = (data: any) => {
    setTypingUser(data);
  };

  const onUserTypingEnd = (data: any) => {
    // if (data.chatId === Number(chatId) && data.userId === typingUser?.userId)
    setTypingUser(null);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(Socket_Event.USER_TYPING, onUserTyping);
    socket.on(Socket_Event.USER_TYPING_END, onUserTypingEnd);
    return () => {
      socket.off(Socket_Event.USER_TYPING, onUserTyping);
      socket.off(Socket_Event.USER_TYPING_END, onUserTypingEnd);
    };
  }, [socket]);

  const chatRoomData = chatRoom?.data;

  const isGroupChat = chatRoomData?.isGroupChat ?? false;

  const user = (chatRoom?.data?.participants.users ?? []).filter(
    (participant) => participant.id !== session?.id
  )?.[0];

  const title = isGroupChat
    ? chatRoomData?.title || `Group chat ${chatRoomData?.id}`
    : user?.fullName ?? "";

  const isShowTypingAnimation =
    typingUser &&
    typingUser.userId !== session?.id &&
    typingUser.chatId === Number(chatId);

  return (
    <div className="flex justify-start items-center">
      <BackButton router={router} />

      <div className="flex gap-3 items-center w-full px-2">
        {isLoading ? (
          <>
            <div className="h-fit flex justify-start items-center">
              <Skeleton className="rounded-full h-[40px] w-[40px] aspect-square" />
            </div>

            <div className="flex flex-col gap-1 truncate w-[75%] items-start">
              <Skeleton className="h-2 w-[50%] max-w-[150px] rounded-medium"></Skeleton>
              <Skeleton className="h-2 w-[40%] max-w-[120px] rounded-medium"></Skeleton>
            </div>
          </>
        ) : (
          isSuccess && (
            <>
              <Badge
                color="success"
                placement="bottom-right"
                content=""
                isInvisible={isGroupChat || !user?.isOnline}
              >
                <Avatar
                  showFallback
                  name={isGroupChat ? undefined : title}
                  fallback={isGroupChat ? <MdGroups size={22} /> : undefined}
                  src={
                    isGroupChat
                      ? chatRoomData?.picture?.src ?? ""
                      : user?.avatarImage?.src ?? ""
                  }
                />
              </Badge>

              <div className="flex flex-col w-[80%]">
                <TypographyLarge className="!text-base">
                  {title}
                </TypographyLarge>
                {!isGroupChat && (
                  <TypographyMuted className="!text-xs">
                    {user?.username}
                  </TypographyMuted>
                )}
                {isShowTypingAnimation && (
                  <TypographyMuted className="!text-xs">
                    {typingUser.fullName} is typing...
                  </TypographyMuted>
                )}
              </div>
            </>
          )
        )}
      </div>
      <ChatMenuTrigger className="justify-self-end" />
    </div>
  );
}
