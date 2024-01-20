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
import { useSession } from "@/stores/auth-store";
import JoinButton from "../button/join-button";
import { MdGroup } from "react-icons/md";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { UpdateRoom } from "@/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { ApiPagingObjectResponse } from "@/types/response";
import { ChatRoom, ChatRoomParticipant } from "@/types/chat";
import { produce } from "immer";
import GroupMenuTrigger from "../menu/group-menu/trigger";
import TextWithLimit from "../text-with-limit";

type InfiniteChatRoomParticipants = InfiniteData<
  ApiPagingObjectResponse<ChatRoomParticipant[]>
>;

export default function GroupPage({ groupId }: { groupId: number }) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { chatRoom, isLoading, isSuccess, error, isError } = useGetChatRoomById(
    Number(groupId)
  );
  const session = useSession();
  const isGroupChat = chatRoom?.data?.isGroupChat ?? false;

  const onUpdatingRoom = (data: UpdateRoom) => {
    console.log(data, "DATA");
    if (data.updating === "participants") {
      if (data.roomId !== groupId) return null;
      queryClient.setQueriesData<InfiniteChatRoomParticipants>(
        keys.participantByRoomId(groupId),
        produce((draft) => {
          if (draft?.pages) {
            draft.pages = draft.pages.filter((p) => p !== undefined);
            draft.pages.forEach((p) => {
              p.data.forEach((d, i) => {
                const isAddingNewParticipants = data.data.find(
                  (it) => it.id === d.id
                );
                const isPromotedToAdmin =
                  data.data.some(
                    (it) => it.id === d.id && it.role === "admin"
                  ) && d.role === "user";
                const isDismissedAsAdmin =
                  data.data.some(
                    (it) => it.id === d.id && it.role === "user"
                  ) && d.role === "admin";
                console.log(isPromotedToAdmin, "promo");
                console.log(isDismissedAsAdmin, "dismiss");
                if (isPromotedToAdmin) {
                  p.data[i].role = "admin";
                  return;
                }
                if (isDismissedAsAdmin) {
                  p.data[i].role = "user";
                  return;
                }
                if (isAddingNewParticipants) {
                  p.data.push(...data.data);
                  return;
                }
              });
            });
          }
        })
      );
    } else if (data.updating === "details") {
      if (data.data.id !== groupId) return null;
      console.log("Hello");
      queryClient.setQueryData<ApiPagingObjectResponse<ChatRoom>>(
        keys.chatByRoomId(groupId),
        produce((draft) => {
          if (draft?.data) {
            draft.data = data.data;
          }
          console.log(draft, "Draft");
        })
      );
    } else if (data.updating === "delete-participants") {
      queryClient.setQueriesData<InfiniteChatRoomParticipants>(
        keys.participantByRoomId(groupId),
        produce((draft) => {
          if (draft?.pages) {
            draft.pages.forEach((p) => {
              p.data.forEach((d) => {
                if (data.data.some((v) => v === d.id)) {
                  p.data = p.data.filter((v) => v.id !== d.id);
                  p.pagination.result_count -= 1;
                  p.pagination.total_records -= 1;
                }
              });
            });
          }
        })
      );
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.UPDATE_ROOM, onUpdatingRoom);
    return () => {
      socket.off(Socket_Event.UPDATE_ROOM, onUpdatingRoom);
    };
  }, [socket]);

  useNotFoundRedirect(error, isError, !isGroupChat && isSuccess);

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
            Group {chatRoom?.data?.participants?.total ?? 0} member
            {(chatRoom?.data?.participants?.total ?? 0) > 1 ? "s" : ""}
          </TypographyMuted>
        )}
        <div className="flex gap-2 justify-between w-full py-2">
          <Button
            color="primary"
            className="flex-1"
            as={Link}
            href={`/chats/${groupId}`}
          >
            Message
          </Button>
          <JoinButton />
          <GroupMenuTrigger variant="solid" radius="md" />
        </div>
        <TextWithLimit text={chatRoom?.data.description ?? ""} />
      </div>
      <GroupMembers groupId={Number(groupId)} />
    </>
  );
}
