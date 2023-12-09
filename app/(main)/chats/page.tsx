"use client";
import ChatDisplay from "@/components/chat/chat-display";
import { TypographyH4 } from "@/components/ui/typography";
import { Input } from "@nextui-org/input";
import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { useGetMyAssociatedChatRooms } from "@/lib/api/account/query";
import CreateRoomModal from "@/components/modal/create-room-modal";
import { IoChatbubbleEllipses } from "react-icons/io5";
import CreateGroupModal from "@/components/modal/create-group-modal";
import UserCardSkeleton from "@/components/user/user-card-skeleton";
import CreateRoomSpeedDial from "@/components/speed-dial/create-room";
import InputSearch from "@/components/input/search";

export default function ChatsPage() {
  const { chatRooms, isSuccess, isError, isLoading } =
    useGetMyAssociatedChatRooms();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const onReceiveMessage = async (createdMessage: any) => {
    queryClient.invalidateQueries({
      queryKey: keys.meChats(),
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    return () => {
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    };
  }, [socket]);

  const totalRooms = chatRooms?.pagination?.total_records ?? 0;

  return (
    <div className="w-full flex flex-col gap-1 pt-5 pb-16">
      <div className="flex flex-col gap-2">
        {/* <TypographyH4 className="!text-base">Active users</TypographyH4> */}
        {/* <Slider classNames={{ body: "gap-5" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((u) => (
            <ChatAvatar key={u} isOnline />
          ))}
        </Slider> */}
      </div>
      <InputSearch
        placeholder="Search users..."
        fullWidth
        className="px-2"
        radius="full"
        autoFocus={false}
      />
      <div className="flex flex-col w-full">
        {isSuccess && totalRooms === 0 && (
          <div className="w-full h-full flex justify-center items-center flex-col gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-1/2">
            <IoChatbubbleEllipses size={25} />
            No chat available
          </div>
        )}
        {isLoading
          ? [1, 2, 3].map((id) => (
              <UserCardSkeleton
                className="rounded-none shadow-none my-0"
                key={id}
              />
            ))
          : isSuccess &&
            (chatRooms?.data ?? []).map((chat) => (
              <ChatDisplay chat={chat} key={chat.id} />
            ))}
      </div>
      <CreateRoomSpeedDial />
      <CreateGroupModal />
      <CreateRoomModal />
    </div>
  );
}
