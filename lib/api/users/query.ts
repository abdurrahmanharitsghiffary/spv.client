"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import {
  baseUserRoutes,
  blockedUserRoute,
  userById,
  userFollowedUsersById,
  userFollowersById,
  userIsFollowed,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPaging } from "@/types";
import { JsendSuccess, JsendWithPaging } from "@/types/response";
import {
  UserAccount,
  UserAccountPublic,
  UserFollowerResponse,
  UserFollowingResponse,
} from "@/types/user";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";

export const useGetUsers = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: usersData, ...rest } = useQuery<JsendWithPaging<UserAccount[]>>(
    {
      queryKey: [...keys.users, options],
      queryFn: () =>
        request
          .get(baseUserRoutes(options), config)
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
    }
  );

  return { usersData, ...rest };
};

export const useGetUserById = (userId: number, config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: userData, ...rest } = useQuery<JsendSuccess<UserAccountPublic>>(
    {
      queryKey: keys.userById(userId),
      queryFn: () =>
        request
          .get(userById(userId.toString()), config)
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
    }
  );

  return { userData, ...rest };
};

export const useGetUserFollowers = (
  userId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();
  const { data: userFollowersData, ...rest } = useQuery<
    JsendSuccess<UserFollowerResponse>
  >({
    queryKey: keys.userFollowers(userId),
    queryFn: () =>
      request
        .get(userFollowersById(userId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { userFollowersData, ...rest };
};

export const useGetUserFollowedUsers = (
  userId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: userFollowedUsersData, ...rest } = useQuery<
    JsendSuccess<UserFollowingResponse>
  >({
    queryKey: keys.userFollowedUsers(userId),
    queryFn: () =>
      request
        .get(userFollowedUsersById(userId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { userFollowedUsersData, ...rest };
};

export const useGetUserIsFollowed = (
  userId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: isFollowed, ...rest } = useQuery<JsendSuccess<boolean>>({
    queryKey: keys.isFollowing(userId),
    queryFn: () =>
      request
        .get(userIsFollowed(userId), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    enabled: userId !== -1 && userId !== undefined,
  });

  return { isFollowed, ...rest };
};

export const useGetBlockedUsers = (
  query?: { offset?: number; limit?: number },
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data, ...rest } = useInfiniteQuery<
    JsendWithPaging<UserAccountPublic[]>
  >({
    queryKey: [...keys.blockedUsers(), query],
    queryFn: ({ pageParam }) =>
      pageParam === null
        ? Promise.resolve(undefined)
        : request
            .get(pageParam ? pageParam : blockedUserRoute(query), config)
            .then((res) => res.data)
            .catch((err) => Promise.reject(err?.response?.data)),
    getNextPageParam: (res) => res?.pagination?.next ?? null,
    getPreviousPageParam: (res) => res?.pagination?.previous ?? null,
  });
  const blockedUsers = useMemo(
    () => ({
      ...data?.pages?.[0],
      data: data?.pages
        ?.map((page) => (page?.data ?? []).filter((data) => data !== undefined))
        .flat(),
    }),
    [data]
  );

  return { data, blockedUsers, ...rest };
};
