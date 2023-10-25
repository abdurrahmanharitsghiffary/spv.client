"use client";

import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import {
  followAccount as followAccountEp,
  followedAccountById,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";

export const useFollowAccount = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: followAccount,
    mutateAsync: followAccountAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { userId: number; config?: AxiosRequestConfig }) => {
      return request
        .post(followAccountEp, { userId: v.userId }, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onMutate: async (v) => {
      // await queryClient.cancelQueries(keys.users);
      await queryClient.cancelQueries(keys.userById(v.userId));
      await queryClient.cancelQueries(keys.isFollowing(v.userId));

      // const users = queryClient.getQueryData(keys.users);
      const user = queryClient.getQueryData(keys.userById(v.userId));
      const userIsFollowed = queryClient.getQueryData(
        keys.isFollowing(v.userId)
      );

      // queryClient.setQueryData(keys.users, (old: any) => {
      //   return {
      //     ...old,
      //     data: (old?.data ?? []).map((user: any) => ({
      //       ...user,
      //       followedBy: {
      //         ...user?.followedBy,
      //         followerIds: [...user?.followedBy?.followerIds, v.userId],
      //         total: user?.followedBy?.total ?? 0 + 1,
      //       },
      //     })),
      //   };
      // });
      queryClient.setQueryData(keys.isFollowing(v.userId), (old: any) => ({
        ...old,
        data: true,
      }));

      queryClient.setQueryData(keys.userById(v.userId), (old: any) => {
        return {
          ...old,
          data: {
            ...old?.data,
            followedBy: {
              ...old?.data?.followedBy,
              followers: [
                ...(old?.data?.followedBy?.followers ?? []),
                { id: v.userId },
              ],
              total: old?.data?.followedBy?.total ?? 0 + 1,
            },
          },
        };
      });

      return { user, userIsFollowed };
    },
    onError: (e, v, ctx) => {
      // queryClient.setQueryData(keys.users, ctx?.users ?? []);
      queryClient.setQueryData(keys.isFollowing(v.userId), ctx?.userIsFollowed);
      queryClient.setQueryData(keys.userById(v.userId), ctx?.user);
    },
    onSettled: (d, e, v) => {
      // queryClient.invalidateQueries({
      //   queryKey: keys.users,
      // });
      queryClient.invalidateQueries({ queryKey: keys.isFollowing(v.userId) });
      queryClient.invalidateQueries({ queryKey: keys.userById(v.userId) });
    },
  });

  return { followAccount, followAccountAsync, ...rest };
};

export const useUnfollowAccount = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: unfollowAccount,
    mutateAsync: unfollowAccountAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { userId: number; config?: AxiosRequestConfig }) => {
      return request
        .delete(followedAccountById(v.userId.toString()), v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onMutate: async (v) => {
      // await queryClient.cancelQueries(keys.users);
      await queryClient.cancelQueries(keys.userById(v.userId));
      await queryClient.cancelQueries(keys.isFollowing(v.userId));

      // const users = queryClient.getQueryData(keys.users);
      const user = queryClient.getQueryData(keys.userById(v.userId));
      const userIsFollowed = queryClient.getQueryData(
        keys.isFollowing(v.userId)
      );

      queryClient.setQueryData(keys.isFollowing(v.userId), (old: any) => ({
        ...old,
        data: false,
      }));

      // queryClient.setQueryData(keys.users, (old: any) => ({
      //   ...old,
      //   data: (old?.data ?? []).map((user: any) => ({
      //     ...user,
      //     followedBy: {
      //       ...user?.followedBy,
      //       followerIds: user?.followedBy?.followerIds.filter(
      //         (u: any) => u !== v.userId
      //       ),
      //       total:
      //         user?.followedBy?.total ?? 0 - 1 === -1
      //           ? 0
      //           : old?.followedBy?.total ?? 0 - 1,
      //     },
      //   })),
      // }));
      queryClient.setQueryData(keys.userById(v.userId), (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          followedBy: {
            ...old?.data?.followedBy,
            followers: (old?.data?.followedBy?.followers ?? []).filter(
              (u: any) => u !== v.userId
            ),
            total:
              old?.data?.followedBy?.total ?? 0 - 1 === -1
                ? 0
                : old?.data?.followedBy?.total ?? 0 - 1,
          },
        },
      }));

      return { user, userIsFollowed };
    },
    onError: (e, v, ctx) => {
      // queryClient.setQueryData(keys.users, ctx?.users);
      queryClient.setQueryData(keys.userById(v.userId), ctx?.user);
      queryClient.setQueryData(keys.isFollowing(v.userId), ctx?.userIsFollowed);
    },
    onSettled: (d, e, v) => {
      // queryClient.invalidateQueries({
      //   queryKey: keys.users,
      // });
      queryClient.invalidateQueries({
        queryKey: keys.isFollowing(v.userId),
      });
      queryClient.invalidateQueries({ queryKey: keys.userById(v.userId) });
    },
  });

  return { unfollowAccount, unfollowAccountAsync, ...rest };
};
