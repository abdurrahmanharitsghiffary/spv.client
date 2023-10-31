"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import {
  baseUserRoutes,
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
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

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
  const {
    data: userFollowersData,
    error,
    ...rest
  } = useQuery<JsendSuccess<UserFollowerResponse>>({
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
  });

  return { isFollowed, ...rest };
};
