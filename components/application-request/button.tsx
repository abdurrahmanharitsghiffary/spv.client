"use client";

import { useGetGroupMembershipRequest } from "@/lib/api/application-request/query";
import { Badge } from "@nextui-org/badge";
import React, { useCallback } from "react";
import Link from "next/link";
import { MdOutlineAssignment } from "react-icons/md";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import IconButton from "../button/icon-button";
import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { AppRequest } from "@/types/app-request";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { ApiPagingObjectResponse } from "@/types/response";
import { produce } from "immer";
import { useIsMounted } from "@/hooks/use-is-mounted";

export default function ApplicationRequestButton({
  groupId,
}: {
  groupId: number;
}) {
  const { resp, isSuccess, error } = useGetGroupMembershipRequest(
    groupId,
    "pending"
  );
  const { chatRoom } = useGetChatRoomById(groupId);
  const queryClient = useQueryClient();

  const isMounted = useIsMounted();

  useSocketOn(
    Socket_Event.DELETE_GAR,
    useCallback(
      (data: { requestId: number; roomId: number }) => {
        if (data.roomId !== groupId) return;

        queryClient.setQueriesData<
          InfiniteData<ApiPagingObjectResponse<AppRequest[]>>
        >(
          keys.gmr("pending"),
          produce((draft) => {
            if (draft?.pages) {
              draft.pages = draft.pages.filter((p) => p !== undefined);
              if (draft?.pages?.[0]) {
                const totalRec = draft.pages[0].pagination.totalRecords;
                const resC = draft.pages[0].pagination.resultCount;
                draft.pages[0].pagination.totalRecords -= totalRec <= 0 ? 0 : 1;
                draft.pages[0].pagination.resultCount -= resC <= 0 ? 0 : 1;
              }
            }
          })
        );
      },
      [groupId]
    )
  );

  useSocketOn(
    Socket_Event.RECEIVE_GAR,
    useCallback(
      (data: { data: AppRequest; roomId: number }) => {
        if (groupId !== data.roomId) return;

        queryClient.setQueriesData<
          InfiniteData<ApiPagingObjectResponse<AppRequest[]>>
        >(
          keys.gmr("pending"),
          produce((draft) => {
            if (draft?.pages) {
              draft.pages = draft.pages.filter((p) => p !== undefined);
              if (draft?.pages?.[0]) {
                draft.pages[0].pagination.totalRecords += 1;
                draft.pages[0].pagination.resultCount += 1;
              }
            }
          })
        );
      },
      [groupId]
    )
  );

  const totalApRq = resp.pagination?.totalRecords ?? 0;

  if (
    !isSuccess ||
    (error as any)?.statusCode === 403 ||
    chatRoom?.data?.applyType === "public" ||
    !isMounted
  )
    return null;

  return (
    <Badge
      color="danger"
      isInvisible={totalApRq < 1}
      content={totalApRq > 99 ? "99+" : totalApRq}
    >
      <IconButton
        variant="solid"
        color="secondary"
        as={Link}
        radius="md"
        href={`/groups/${groupId}/membership-requests`}
      >
        <MdOutlineAssignment />
      </IconButton>
    </Badge>
  );
}
