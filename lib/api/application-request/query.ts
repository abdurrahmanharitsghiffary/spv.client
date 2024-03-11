"use client";

import { keys } from "@/lib/queryKey";
import { useInfinite, useQ } from "../hooks";
import { OffsetPaging } from "@/types";
import { groupAppReq, urlBase } from "@/lib/endpoints";
import { MembershipRequest } from "@/types/app-request";

type GetMembershipRequestParams = {
  type: "pending" | "approved" | "rejected" | "all";
  query?: OffsetPaging;
};

export const useGetGroupMembershipRequest = (
  groupId: number,
  type: GetMembershipRequestParams["type"] = "pending",
  query?: GetMembershipRequestParams["query"]
) => {
  const q = {
    limit: query?.limit?.toString() ?? "20",
    offset: query?.offset?.toString() ?? "0",
  };

  const { data: resp, ...rest } = useInfinite<MembershipRequest>({
    query: { q, type },
    queryKey: [...keys.gmr(type), q],
    url: groupAppReq(groupId),
  });

  return { resp, ...rest };
};

export const useGetMyMembershipRequest = (
  type: GetMembershipRequestParams["type"] = "all",
  query?: GetMembershipRequestParams["query"]
) => {
  const q = {
    limit: query?.limit?.toString() ?? "20",
    offset: query?.offset?.toString() ?? "0",
  };

  const { data: resp, ...rest } = useInfinite<MembershipRequest>({
    query: { ...q, type },
    queryKey: [...keys.meMr(type), q],
    url: urlBase("/me/membership-requests"),
  });

  return { resp, ...rest };
};

export const useGetMembershipRequestById = (requestId: number) => {
  const { data: resp, ...rest } = useQ<MembershipRequest>({
    url: urlBase(`/me/membership-requests/${requestId}`),
    queryKey: keys.meMrById(requestId),
  });

  return { resp, ...rest };
};
