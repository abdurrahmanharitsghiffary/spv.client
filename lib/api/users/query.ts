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
import { ApiResponseT, ApiPagingObjectResponse } from "@/types/response";
import {
  UserAccount,
  UserAccountPublic,
  UserFollowerResponse,
  UserFollowingResponse,
} from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useInfinite } from "../hooks";

export const useGetUsers = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: usersData, ...rest } = useQuery<
    ApiPagingObjectResponse<UserAccount[]>
  >({
    queryKey: [...keys.users, options],
    queryFn: () =>
      request
        .get(baseUserRoutes(options), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { usersData, ...rest };
};

export const useGetUserById = (userId: number, config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: userData, ...rest } = useQuery<ApiResponseT<UserAccountPublic>>(
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
    ApiResponseT<UserFollowerResponse>
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
    ApiResponseT<UserFollowingResponse>
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

  const { data: isFollowed, ...rest } = useQuery<ApiResponseT<boolean>>({
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
  const { data: blockedUsers, ...rest } = useInfinite<UserAccountPublic>({
    query: {
      offset: query?.offset?.toString(),
      limit: query?.limit?.toString(),
    },
    url: blockedUserRoute(query),
    queryKey: [...keys.blockedUsers(), query],
    config,
  });

  return { blockedUsers, ...rest };
};
