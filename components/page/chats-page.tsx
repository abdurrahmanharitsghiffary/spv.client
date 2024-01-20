"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { useGetMyAssociatedChatRooms } from "@/lib/api/account/query";
import CreateRoomModal from "@/components/modal/create-room-modal";
import { IoChatbubbleEllipses } from "react-icons/io5";
import CreateGroupModal from "@/components/modal/create-group-modal";
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
import { useParams } from "next/navigation";
import clsx from "clsx";
import CreateRoomButton from "../button/create-room-button";
import { useSession } from "@/stores/auth-store";
import { removeDuplicates } from "@/lib/remove-duplicates";
import { produce } from "immer";
import { Immer } from "@/lib/api/utils";

type InfiniteRoomPaging = InfiniteData<ApiPagingObjectResponse<ChatRoom[]>>;

export default function ChatsPage() {
  const { chatId } = useParams();
  const [q, setQ] = useState("");
  const session = useSession();
  const [selectedKey, setSelectedKey] = useState<Key>("all");
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

  const rooms = useMemo(
    () => removeDuplicates(chatRooms?.data ?? [], "id"),
    [chatRooms?.data]
  );

  const onJoinChatRoom = async (joinedRoom: ChatRoom) => {
    // this is also correct
    queryClient.setQueriesData<InfiniteRoomPaging>(
      keys.meChats(),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages = draft.pages.filter((p) => p !== undefined);

          if (draft.pages?.[0]) {
            draft.pages[0].data.unshift(joinedRoom);
            draft.pages[0].pagination.total_records += 1;
            draft.pages[0].pagination.result_count += 1;
            draft.pages[0].pagination.limit += 1;
          }
        }
      })
    );
  };

  const onReceiveMessage = async (createdMessage: Chat) => {
    // No Problem, this correct
    const isNotAuthored = createdMessage.author.id !== session?.id;
    queryClient.setQueriesData<InfiniteRoomPaging>(
      keys.meChats(),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages.forEach((p, pi) => {
            p.data.forEach((cht, ci) => {
              if (cht.id === createdMessage.roomId) {
                draft.pages[pi].data[ci].messages.unshift(createdMessage);
                if (isNotAuthored)
                  draft.pages[pi].data[ci].unreadMessages.total += 1;
              }
            });
          });
        }
      })
    );
  };

  const onReadedMessage = (data: UserChatRead & { roomId: number }) => {
    // when some user reading message we do not other user also reading the message (decrement unreadMessages total count)
    if (data.id !== session?.id) return;
    queryClient.setQueriesData<InfiniteRoomPaging>(
      keys.meChats(),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages.forEach((p, pi) => {
            p.data.forEach((msg, mi) => {
              if (msg.id === data.roomId) {
                draft.pages[pi].data[mi].unreadMessages.total -= 1;
              }
            });
          });
        }
      })
    );
  };

  const onLeaveRoom = (data: { roomId: number; userId: number }) => {
    const { userId, roomId } = data;
    if (userId === session?.id) {
      queryClient.setQueriesData<InfiniteRoomPaging>(
        keys.meChats(),
        produce((draft) => {
          if (draft?.pages) {
            draft.pages.forEach((p, pi) => {
              p.data.forEach((cht) => {
                if (cht.id === roomId) {
                  draft.pages[pi].data = p.data.filter((d) => d.id !== roomId);
                  draft.pages[pi].pagination.result_count -= 1;
                  draft.pages[pi].pagination.total_records -= 1;
                }
              });
            });
          }
        })
      );
    } else if (userId !== session?.id) {
      queryClient.setQueriesData<InfiniteRoomPaging>(
        keys.meChats(),
        produce((draft) => {
          if (draft?.pages) {
            draft.pages.forEach((p, pi) => {
              p.data.forEach((cht, i) => {
                if (cht.id === roomId) {
                  if (p.data[i].participants) {
                    draft.pages[pi].data[i].participants.users = p.data[
                      i
                    ].participants.users.filter((user) => user.id !== userId);
                    draft.pages[pi].data[i].participants.total -= 1;
                  }
                }
              });
            });
          }
        })
      );
    }
  };

  const onUpdateRoom = (updatedRoom: UpdateRoom) => {
    console.log(updatedRoom, "Updating Room");
    if (updatedRoom.updating === "details") {
      queryClient.setQueriesData<InfiniteRoomPaging>(
        keys.meChats(),
        (oldData) => Immer.updatePagingData(oldData, updatedRoom.data, "id")
      );
    }
  };

  const onDeletingRoom = (roomId: number) => {
    queryClient.setQueriesData<InfiniteRoomPaging>(keys.meChats(), (oldData) =>
      Immer.deletePagingData(oldData, roomId, "id")
    );
  };

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
  });

  useEffect(() => {
    if (!socket) return;
    socket.on(Socket_Event.DELETE_ROOM, onDeletingRoom);
    socket.on(Socket_Event.JOIN_ROOM, onJoinChatRoom);
    socket.on(Socket_Event.LEAVE_ROOM, onLeaveRoom);
    socket.on(Socket_Event.UPDATE_ROOM, onUpdateRoom);
    socket.on(Socket_Event.RECEIVE_MESSAGE, onReceiveMessage);
    socket.on(Socket_Event.READED_MESSAGE, onReadedMessage);
    return () => {
      socket.off(Socket_Event.DELETE_ROOM, onDeletingRoom);
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
        "w-full flex flex-col gap-1 pt-3",
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
          isSuccess && <ChatListbox chats={rooms} />
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
