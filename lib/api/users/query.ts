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
  UserFollowingResponse,
  UserSimplified,
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
  query: { offset?: number; limit?: number } = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: {
      offset: query?.offset?.toString(),
      limit: query?.limit?.toString(),
    },
    url: userFollowersById(userId.toString(), query),
    queryKey: [...keys.userFollowers(userId), query],
    config,
  });

  return { resp, ...rest };
};

export const useGetUserFollowedUsers = (
  userId: number,
  query: { offset?: number; limit?: number } = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: {
      offset: query?.offset?.toString(),
      limit: query?.limit?.toString(),
    },
    url: userFollowedUsersById(userId.toString(), query),
    queryKey: [...keys.userFollowedUsers(userId), query],
    config,
  });

  return { resp, ...rest };
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
  query: { offset?: number; limit?: number } = { limit: 20, offset: 0 },
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
