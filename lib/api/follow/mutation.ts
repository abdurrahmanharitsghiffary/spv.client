"use client";

import { followAccount as followAccountEp } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { useOptimistic } from "../hooks";
import { produce } from "immer";
import { ApiResponseT } from "@/types/response";
import { UserAccountPublic } from "@/types/user";

export const useFollowAccount = () => {
  const {
    optimistic: followAccount,
    optimisticAsync: followAccountAsync,
    ...rest
  } = useOptimistic<{ userId: number }>({
    baseUrl: followAccountEp,
    method: "post",
    optimisticUpdater: (v) => {
      const uId = Number(v.body?.userId);
      return [
        {
          queryKey: keys.userById(uId),
          updater: <OD extends ApiResponseT<UserAccountPublic>>(
            oldData: OD
          ): OD =>
            produce(oldData, (draft) => {
              if (draft?.data) {
                draft.data.count.followedBy += 1;
              }
            }),
        },
        {
          queryKey: keys.isFollowing(uId),
          updater: (oldData) => ({ ...oldData, data: true }),
        },
      ];
    },
  });

  return { followAccount, followAccountAsync, ...rest };
};

export const useUnfollowAccount = () => {
  const {
    optimistic: unfollowAccount,
    optimisticAsync: unfollowAccountAsync,
    ...rest
  } = useOptimistic<undefined, { userId: number }>({
    baseUrl: followAccountEp + "/:userId",
    method: "delete",
    optimisticUpdater: (v) => {
      const uId = Number(v.params?.userId);
      return [
        {
          queryKey: keys.userById(uId),
          updater: <OD extends ApiResponseT<UserAccountPublic>>(
            oldData: OD
          ): OD =>
            produce(oldData, (draft) => {
              if (draft?.data) {
                draft.data.count.followedBy +=
                  draft.data.count.followedBy > 0 ? -1 : 0;
              }
            }),
        },
        {
          queryKey: keys.isFollowing(uId),
          updater: (oldData) => ({ ...oldData, data: false }),
        },
      ];
    },
  });

  return { unfollowAccount, unfollowAccountAsync, ...rest };
};
