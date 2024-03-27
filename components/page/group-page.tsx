"use client";

import React, { useEffect } from "react";
import { TypographyH3, TypographyMuted } from "../ui/typography";
import { Button } from "@nextui-org/button";
import GroupMembers from "../group/group-members";
import AvatarWithPreview from "../image/avatar-with-preview";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import Link from "next/link";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { Skeleton } from "@nextui-org/skeleton";
import JoinButton from "../button/join-button";
import { MdGroup } from "react-icons/md";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { DeleteParticipantsData, ParticipantsData, UpdateRoom } from "@/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { ApiPagingObjectResponse } from "@/types/response";
import { ChatRoom, ChatRoomParticipant } from "@/types/chat";
import { produce } from "immer";
import GroupMenuTrigger from "../menu/group-menu/trigger";
import TextWithLimit from "../text-with-limit";
import ApplicationRequestButton from "../application-request/button";

type InfiniteChatRoomParticipants = InfiniteData<
  ApiPagingObjectResponse<ChatRoomParticipant[]>
>;

export default function GroupPage({ groupId }: { groupId: number }) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { chatRoom, isLoading, isSuccess, error, isError } = useGetChatRoomById(
    Number(groupId)
  );
  const isGroupChat = chatRoom?.data?.isGroupChat ?? false;
  const isForbidden = chatRoom?.statusCode === 403 && isSuccess;

  const onAddPartipants = async (data: ParticipantsData) => {
    if (data.roomId !== groupId) return null;
    queryClient.setQueriesData<InfiniteChatRoomParticipants>(
      keys.participantByRoomId(groupId),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages = draft.pages.filter((p) => p !== undefined);
          if (draft?.pages?.[0]) {
            draft.pages[0].data.unshift(...data.data);
            draft.pages[0].pagination.totalRecords += 1;
            draft.pages[0].pagination.resultCount += 1;
            draft.pages[0].pagination.limit += 1;
          }
        }
      })
    );
  };

  const onUpdateParticipants = async (data: ParticipantsData) => {
    if (data.roomId !== groupId) return null;
    queryClient.setQueriesData<InfiniteChatRoomParticipants>(
      keys.participantByRoomId(groupId),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages.forEach((p, pi) => {
            if (p.data) {
              p.data.forEach((d, di) => {
                const updatedP = data.data.find((dt) => dt.id === d.id);
                if (updatedP) {
                  draft.pages[pi].data[di] = updatedP;
                }
              });
            }
          });
        }
      })
    );
  };

  const onDeleteParticipants = (data: DeleteParticipantsData) => {
    if (data.roomId !== groupId) return null;
    queryClient.setQueriesData<InfiniteChatRoomParticipants>(
      keys.participantByRoomId(groupId),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages.forEach((p) => {
            if (p.data) {
              p.data = p.data.filter(
                (d) => !data.data.some((id) => id === d.id)
              );
            }
          });
        }
      })
    );
  };

  const onUpdatingRoom = (data: UpdateRoom) => {
    if (data.data.id !== groupId) return null;
    queryClient.setQueryData<ApiPagingObjectResponse<ChatRoom>>(
      keys.chatByRoomId(groupId),
      produce((draft) => {
        if (draft?.data) {
          draft.data = data.data;
        }
      })
    );
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.ADD_PARTICIPANTS, onAddPartipants);
    socket.on(Socket_Event.UPDATE_PARTICIPANTS, onUpdateParticipants);
    socket.on(Socket_Event.DELETE_PARTICIPANTS, onDeleteParticipants);
    socket.on(Socket_Event.UPDATE_ROOM, onUpdatingRoom);
    return () => {
      socket.off(Socket_Event.ADD_PARTICIPANTS, onAddPartipants);
      socket.off(Socket_Event.UPDATE_PARTICIPANTS, onUpdateParticipants);
      socket.off(Socket_Event.DELETE_PARTICIPANTS, onDeleteParticipants);
      socket.off(Socket_Event.UPDATE_ROOM, onUpdatingRoom);
    };
  }, [socket]);

  useNotFoundRedirect(
    error,
    isError,
    (!isGroupChat && isSuccess) || isForbidden
  );

  return (
    <>
      <div className="w-32 h-32 rounded-full z-10 mx-auto">
        <AvatarWithPreview
          color="default"
          isBordered
          src={chatRoom?.data?.picture?.src}
          alt={chatRoom?.data?.title ?? "Group picture"}
          showFallback
          fallback={<MdGroup size={40} />}
          className="object-cover text-default-800 dark:text-default-foreground min-h-[128px] max-h-[128px] rounded-full min-w-[128px] max-w-[128px] object-center"
        />
      </div>
      <div className="w-full flex flex-col gap-2 px-4">
        {isLoading ? (
          <Skeleton className="h-[16px] rounded-full mx-auto w-[80px]" />
        ) : (
          <TypographyH3 className="text-center">
            {chatRoom?.data?.title}
          </TypographyH3>
        )}
        {isLoading ? (
          <Skeleton className="h-[14px] rounded-full mx-auto w-[90px]" />
        ) : (
          <TypographyMuted className="text-center">
            Group {chatRoom?.data?.totalParticipants ?? 0} member
            {(chatRoom?.data?.totalParticipants ?? 0) > 1 ? "s" : ""}
          </TypographyMuted>
        )}
        <div className="flex gap-2 justify-between w-full py-2">
          <Button
            color="primary"
            className="flex-1 font-semibold"
            as={Link}
            href={`/chats/${groupId}`}
          >
            Message
          </Button>
          <ApplicationRequestButton groupId={Number(groupId)} />
          <JoinButton groupId={Number(groupId)} />
          <GroupMenuTrigger variant="solid" radius="md" />
        </div>
        <TextWithLimit text={chatRoom?.data.description ?? ""} />
      </div>
      <GroupMembers groupId={Number(groupId)} />
    </>
  );
}
