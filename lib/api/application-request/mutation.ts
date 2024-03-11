"use client";

import { baseGroupRoutes, baseMeRoutes } from "@/lib/endpoints";
import { useMutate } from "../hooks";

export const useRequestGroupMembership = () => {
  const {
    mutate: requestGroupMembership,
    mutateAsync: requestGroupMembershipAsync,
    ...rest
  } = useMutate<{ comment?: string }, { groupId: number }>({
    baseUrl: baseGroupRoutes + "/:groupId/membership-requests",
    method: "post",
  });

  return { requestGroupMembership, requestGroupMembershipAsync, ...rest };
};

export const useApproveGroupMembershipRequest = () => {
  const {
    mutate: approveGMR,
    mutateAsync: approveGMRAsync,
    ...rest
  } = useMutate<undefined, { groupId: number; requestId: number }>({
    baseUrl:
      baseGroupRoutes + "/:groupId/membership-requests/:requestId/approve",
    method: "post",
  });

  return { approveGMR, approveGMRAsync, ...rest };
};

export const useRejectGroupMembershipRequest = () => {
  const {
    mutate: rejectGMR,
    mutateAsync: rejectGMRAsync,
    ...rest
  } = useMutate<undefined, { groupId: number; requestId: number }>({
    baseUrl:
      baseGroupRoutes + "/:groupId/membership-requests/:requestId/reject",
    method: "delete",
  });

  return { rejectGMR, rejectGMRAsync, ...rest };
};

export const useDeleteGroupMembershipRequest = () => {
  const {
    mutate: deleteGMR,
    mutateAsync: deleteGMRAsync,
    ...rest
  } = useMutate<undefined, { requestId: number }>({
    baseUrl: baseMeRoutes + "/membership-requests/:requestId",
    method: "delete",
  });

  return { deleteGMR, deleteGMRAsync, ...rest };
};
