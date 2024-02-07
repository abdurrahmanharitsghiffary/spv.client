"use client";

import { baseUserRoutes, blockUserRoute } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { UpdateUserDataOptions } from "@/types";
import { useMutate } from "../hooks";

// NU
export const useUpdateUser = () => {
  const {
    mutate: updateUser,
    mutateAsync: updateUserAsync,
    ...rest
  } = useMutate<UpdateUserDataOptions, { userId: number }>({
    baseUrl: baseUserRoutes + "/:userId",
    method: "patch",
    invalidateTags: (v) => [keys.userById(Number(v.params?.userId))],
  });

  return { updateUser, updateUserAsync, ...rest };
};

export const useDeleteUser = () => {
  const {
    mutate: deleteUser,
    mutateAsync: deleteUserAsync,
    ...rest
  } = useMutate<undefined, { userId: number }>({
    baseUrl: baseUserRoutes + "/:userId",
    method: "delete",
    invalidateTags: (v) => [keys.userById(Number(v.params?.userId))],
  });

  return { deleteUser, deleteUserAsync, ...rest };
};

export const useBlockUser = () => {
  const {
    mutate: blockUser,
    mutateAsync: blockUserAsync,
    ...rest
  } = useMutate<{ userId: number }>({
    baseUrl: blockUserRoute,
    method: "post",
    invalidateTags: (v) => [
      keys.counts(["unread_messages"]),
      keys.counts(["unread_notifications"]),
      keys.userById(Number(v.body?.userId)),
      keys.blockedUsers(),
    ],
  });

  return { blockUser, blockUserAsync, ...rest };
};

export const useUnblockUser = () => {
  const {
    mutate: unblock,
    mutateAsync: unblockAsync,
    ...rest
  } = useMutate<undefined, { userId: number }>({
    baseUrl: blockUserRoute + "/:userId",
    method: "delete",
    invalidateTags: (v) => [
      keys.counts(["unread_messages"]),
      keys.counts(["unread_notifications"]),
      keys.userById(Number(v.params?.userId)),
      keys.blockedUsers(),
    ],
  });

  return { unblock, unblockAsync, ...rest };
};
