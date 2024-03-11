"use client";

import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { useGetGroupMembershipRequest } from "@/lib/api/application-request/query";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { TypographyH3 } from "../ui/typography";
import AppRequest from "../application-request";
import { Spinner } from "@nextui-org/spinner";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { AppRequest as ApRq } from "@/types/app-request";
import { ApiPagingObjectResponse } from "@/types/response";
import { Select, SelectItem } from "@nextui-org/select";
import { Immer } from "@/lib/api/utils";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";

type DT = { requestId: number; roomId: number };
type IARQ = InfiniteData<ApiPagingObjectResponse<ApRq[]>>;

export default function GarPage() {
  const { groupId } = useParams();
  const gId = Number(groupId);
  const [type, setType] = useState<"pending" | "all" | "rejected" | "approved">(
    "pending"
  );
  const {
    resp,
    isFetchingNextPage,
    isLoading,
    isSuccess,
    error,
    isError,
    fetchNextPage,
    isFetching,
  } = useGetGroupMembershipRequest(gId, type);
  const socket = useSocket();
  const queryClient = useQueryClient();

  const onDeleteGar = useCallback(
    async (data: { roomId: number; requestId: number }) => {
      if (data.roomId !== gId) return;
      queryClient.setQueriesData<IARQ>(keys.gmr("pending"), (oldData) =>
        Immer.deletePagingData(oldData, data.requestId, "id")
      );

      queryClient.setQueriesData<IARQ>(keys.gmr("all"), (oldData) =>
        Immer.deletePagingData(oldData, data.requestId, "id")
      );
    },
    [gId]
  );

  const onRejectedGar = useCallback(
    async (data: DT) => {
      console.log("HAHAYYUKKSS");
      if (data.roomId !== gId) return null;
      queryClient.setQueriesData<IARQ>(keys.gmr("pending"), (oldData) =>
        Immer.deletePagingData(oldData, data.requestId, "id")
      );
    },
    [gId]
  );

  const onApprovedGar = useCallback(
    async (data: { requestId: number; roomId: number }) => {
      if (data.roomId !== gId) return null;
      queryClient.setQueriesData<IARQ>(keys.gmr("pending"), (oldData) =>
        Immer.deletePagingData(oldData, data.requestId, "id")
      );
    },
    [gId]
  );

  const onReceiveGar = useCallback(
    async (data: { data: ApRq; roomId: number }) => {
      if (data.roomId !== gId) return;

      queryClient.invalidateQueries({
        queryKey: ["membership-requests", "group"],
      });
      // queryClient.setQueriesData<IARQ>(
      //   keys.gmr("pending"),
      //   produce((draft) => {
      //     if (draft?.pages) {
      //       draft.pages = draft.pages.filter((p) => p !== undefined);
      //       if (draft?.pages?.[0]) {
      //         draft.pages[0].data.unshift(data.data);
      //         draft.pages[0].pagination.totalRecords += 1;
      //         draft.pages[0].pagination.resultCount += 1;
      //         draft.pages[0].pagination.limit += 1;
      //       }
      //     }
      //   })
      // );
    },
    [gId]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.DELETE_GAR, onDeleteGar);
    socket.on(Socket_Event.APPROVE_GAR, onApprovedGar);
    socket.on(Socket_Event.REJECT_GAR, onRejectedGar);
    socket.on(Socket_Event.RECEIVE_GAR, onReceiveGar);

    return () => {
      socket.off(Socket_Event.DELETE_GAR, onDeleteGar);
      socket.off(Socket_Event.APPROVE_GAR, onApprovedGar);
      socket.off(Socket_Event.REJECT_GAR, onRejectedGar);
      socket.off(Socket_Event.RECEIVE_GAR, onReceiveGar);
    };
  }, [socket]);

  const { ref: fetcherRef } = useFetchNextPageObserver({
    isDisabled: !isSuccess,
    fetchNextPage,
    isFetching,
  });

  const appRequests = resp?.data ?? [];
  const totalRequests = resp?.pagination?.totalRecords ?? 0;
  const statusCode = (error as any)?.statusCode;
  useNotFoundRedirect(error, isError);

  const handleSelect = (key: "all" | Set<React.Key>) => {
    setType(key === "all" ? "all" : (Array.from(key)[0] as any));
  };

  if (statusCode === 403) {
    return (
      <div className="mx-auto text-center">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-3">
      <TypographyH3 className="!text-base">
        Member request{totalRequests > 1 ? "s" : ""} ({totalRequests})
      </TypographyH3>
      <Select
        size="sm"
        label="Status"
        className="min-w-[115px] max-w-[115px]"
        defaultSelectedKeys={["pending"]}
        value={type}
        onSelectionChange={handleSelect}
      >
        <SelectItem key="all">All</SelectItem>
        <SelectItem key="rejected">Rejected</SelectItem>
        <SelectItem key="pending">Pending</SelectItem>
        <SelectItem key="approved">Approved</SelectItem>
      </Select>
      {isLoading ? (
        <Spinner className="m-4" />
      ) : (
        appRequests.map((r, i) => (
          <AppRequest
            groupId={r.groupId}
            appRequest={r}
            key={(r?.comment ?? "") + i}
          />
        ))
      )}
      <div ref={fetcherRef}></div>
      {isFetchingNextPage && <Spinner className="mx-4 my-4" />}
    </div>
  );
}
