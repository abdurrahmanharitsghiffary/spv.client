"use client";
import ChatDisplay from "@/components/chat/chat-display";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
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
import { Key, UpdateRoom } from "@/types";
import { Chat, ChatRoom, UserChatRead } from "@/types/chat";
import { ApiPagingObjectResponse } from "@/types/response";
import UserListboxLoading from "../loading/user-listbox-loading";
import ChatListbox from "../chat/chat-listbox";
import { MdOutlineSearchOff } from "react-icons/md";
import {
  deletePagingData,
  prependPagingData,
  updatePagingData,
} from "@/lib/api/utils";
import { useParams } from "next/navigation";
import clsx from "clsx";
import CreateRoomButton from "../button/create-room-button";
import { useSession } from "@/stores/auth-store";

type InfiniteRoomPaging = InfiniteData<ApiPagingObjectResponse<ChatRoom[]>>;

export default function ChatsPage() {
  const { chatId } = useParams();
  const [q, setQ] = useState("");
  const session = useSession();
  const [selectedKey, setSelectedKey] = useState<Key>("all");
  const {
    chatRooms,
    isSuccess,
    infiniteData,
    isFetchNextNotAvailable,
    hasNextPage,
    isFetching,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyAssociatedChatRooms({ type: selectedKey as any, q });
  const socket = useSocket();
  const queryClient = useQueryClient();

  const onJoinChatRoom = async (joinedRoom: ChatRoom) => {
    queryClient.setQueriesData<InfiniteRoomPaging>(keys.meChats(), (oldData) =>
      prependPagingData(oldData, joinedRoom)
    );
    queryClient.invalidateQueries({ queryKey: keys.meChats() });
  };

  const onReceiveMessage = async (createdMessage: Chat) => {
    queryClient.setQueriesData<InfiniteRoomPaging>(
      keys.meChats(),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((p, i) => {
            if (!p) return p;
            return {
              ...p,
              data: p.data.map((c) => {
                if (c.id === createdMessage.roomId) {
                  return {
                    ...c,
                    messages: [createdMessage, ...c.messages],
                    unreadMessages: {
                      total:
                        c.unreadMessages.total +
                        (createdMessage?.author?.id !== session?.id ? 1 : 0),
                    },
                  };
                }
                return c;
              }),
            };
          }),
        };
      }
    );
  };

  const onReadedMessage = (data: UserChatRead & { roomId: number }) => {
    queryClient.setQueriesData<InfiniteRoomPaging>(
      keys.meChats(),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((p) => {
            if (!p) return p;
            return {
              ...p,
              data: p.data.map((c) => {
                if (c.id === data.roomId) {
                  return {
                    ...c,
                    unreadMessages: {
                      ...c.unreadMessages,
                      total: c.unreadMessages.total - 1,
                    },
                  };
                }
                return c;
              }),
            };
          }),
        };
      }
    );
  };

  const onLeaveRoom = (roomId: number) => {
    queryClient.setQueriesData<InfiniteRoomPaging>(keys.meChats(), (oldData) =>
      deletePagingData(oldData, roomId, "id")
    );
  };

  const onUpdateRoom = (updatedRoom: UpdateRoom) => {
    if (updatedRoom.updating === "details") {
      queryClient.setQueriesData<InfiniteRoomPaging>(
        keys.meChats(),
        (oldData) => updatePagingData(oldData, updatedRoom.data, "id")
      );
    }
  };

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
  });

  useEffect(() => {
    if (!socket) return;
    socket.on(Socket_Event.JOIN_ROOM, onJoinChatRoom);
    socket.on(Socket_Event.LEAVE_ROOM, onLeaveRoom);
    socket.on(Socket_Event.UPDATE_ROOM, onUpdateRoom);
    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    socket.on(Socket_Event.READED_MESSAGE, onReadedMessage);
    return () => {
      socket.off(Socket_Event.JOIN_ROOM, onJoinChatRoom);
      socket.off(Socket_Event.LEAVE_ROOM, onLeaveRoom);
      socket.off(Socket_Event.UPDATE_ROOM, onUpdateRoom);
      socket.off(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
      socket.off(Socket_Event.READED_MESSAGE, onReadedMessage);
    };
  }, [socket]);

  const totalRooms = chatRooms?.pagination?.total_records ?? 0;

  return (
    <div
      className={clsx(
        "w-full flex flex-col gap-1 pt-3 pb-16",
        chatId &&
          "sm:max-w-[300px] hidden sm:flex lg:max-w-[400px] fixed top-0 border-r-1 border-divider max-w-[70px] bottom-0 z-[101] !pb-3 bg-background scrollbar-hide left-0"
      )}
    >
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
      <div className="flex gap-1 justify-between w-full px-4 sm:px-2">
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
          radius="full"
          autoFocus={false}
        />
        {chatId && <CreateRoomButton />}
      </div>

      <div className="flex flex-col w-full hide-scrollbar overflow-y-auto">
        {isSuccess && totalRooms === 0 && (
          <div className="w-full h-full flex justify-center items-center flex-col gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-1/2">
            {q ? (
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <MdOutlineSearchOff size={25} />
                <span>No result found.</span>
              </div>
            ) : (
              <>
                <IoChatbubbleEllipses size={25} />
                No chat available
              </>
            )}
          </div>
        )}
        {isLoading ? (
          <UserListboxLoading showDivider />
        ) : (
          isSuccess && <ChatListbox chats={chatRooms?.data ?? []} />
        )}
        {isFetchingNextPage && (
          <Spinner color="primary" className="my-4 mx-auto" />
        )}
      </div>
      <div id="next_ftcr" ref={ref}></div>
      {!chatId && <CreateRoomSpeedDial />}
      <CreateGroupModal />
      <CreateRoomModal />
    </div>
  );
}
