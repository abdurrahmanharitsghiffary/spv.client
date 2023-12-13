"use client";
import ChatDisplay from "@/components/chat/chat-display";
import React, { useEffect, useState } from "react";
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
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Key } from "@/types";

export default function ChatsPage() {
  const [q, setQ] = useState("");
  const [selectedKey, setSelectedKey] = useState<Key>("all");
  console.log(selectedKey, "Sel Key");
  const {
    chatRooms,
    isSuccess,
    isFetchNextNotAvailable,
    isFetching,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyAssociatedChatRooms({ type: selectedKey as any, q });
  const socket = useSocket();
  const queryClient = useQueryClient();
  console.log(chatRooms, "ChatRooms");
  const onReceiveMessage = async (createdMessage: any) => {
    queryClient.invalidateQueries({
      queryKey: keys.meChats(),
    });
  };

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    return () => {
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    };
  }, [socket]);

  const totalRooms = chatRooms?.pagination?.total_records ?? 0;

  return (
    <div className="w-full flex flex-col gap-1 pt-3 pb-16">
      <div className="flex flex-col gap-2"></div>
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        fullWidth
        variant="underlined"
        className="pb-2"
        disableAnimation
      >
        <Tab key="all" title="All"></Tab>
        <Tab key="personal" title="Personal"></Tab>
        <Tab key="group" title="Group"></Tab>
      </Tabs>
      <InputSearch
        placeholder={
          selectedKey === "all"
            ? "Search users or groups..."
            : selectedKey === "group"
            ? "Search groups..."
            : "Search users..."
        }
        onClear={() => setQ("")}
        onValueChange={setQ}
        value={q}
        variant="faded"
        fullWidth
        className="px-4"
        radius="full"
        autoFocus={false}
      />
      <div className="flex flex-col w-full">
        {isSuccess && totalRooms === 0 && (
          <div className="w-full h-full flex justify-center items-center flex-col gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-1/2">
            {q ? (
              <span>No result found</span>
            ) : (
              <>
                <IoChatbubbleEllipses size={25} />
                No chat available
              </>
            )}
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
        {isFetchingNextPage && (
          <Spinner color="primary" className="my-4 mx-auto" />
        )}
      </div>
      <div id="next_ftcr" ref={ref}></div>
      <CreateRoomSpeedDial />
      <CreateGroupModal />
      <CreateRoomModal />
    </div>
  );
}
