"use client";

import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { useGetMyMembershipRequest } from "@/lib/api/application-request/query";
import React, { useCallback, useState } from "react";
import { TypographyH3 } from "../ui/typography";
import AppRequest from "../application-request";
import { Spinner } from "@nextui-org/spinner";
import { Select, SelectItem } from "@nextui-org/select";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { Immer } from "@/lib/api/utils";
import { ApiPagingObjectResponse } from "@/types/response";
import { MembershipRequest } from "@/types/app-request";

export default function MembershipPage() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<"pending" | "all" | "rejected" | "approved">(
    "all"
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
  } = useGetMyMembershipRequest(type);

  const { ref: fetcherRef } = useFetchNextPageObserver({
    isDisabled: !isSuccess,
    fetchNextPage,
    isFetching,
  });

  useSocketOn(
    Socket_Event.DELETE_GAR,
    useCallback((data: { requestId: number; roomId: number }) => {
      queryClient.setQueriesData<
        InfiniteData<ApiPagingObjectResponse<MembershipRequest[]>>
      >(["me", "membership-requests"], (oldData) =>
        Immer.deletePagingData(oldData, data.requestId, "id")
      );
    }, [])
  );

  const appRequests = resp?.data ?? [];
  console.log(appRequests, "App requests");
  const totalRequests = resp?.pagination?.totalRecords ?? 0;
  useNotFoundRedirect(error, isError);

  const handleSelect = (key: "all" | Set<React.Key>) => {
    setType(key === "all" ? "all" : (Array.from(key)[0] as any));
  };

  return (
    <div className="flex flex-col pt-6 w-full gap-4 px-4 pb-3">
      <TypographyH3 className="!text-base">
        Member request{totalRequests > 1 ? "s" : ""} ({totalRequests})
      </TypographyH3>
      <Select
        size="sm"
        label="Status"
        className="min-w-[115px] max-w-[115px]"
        defaultSelectedKeys={["all"]}
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
