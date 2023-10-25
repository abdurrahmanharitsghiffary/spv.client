"use client";
import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
import { JsendSuccess, JsendWithPaging } from "@/types/response";
import { UserAccount } from "@/types/user";
import { AxiosRequestConfig } from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  myAccount as myAccountEp,
  myChats as myChatsEp,
  myFollowedUsers as myFollowedUsersEp,
  myFollowers as myFollowersEp,
  myPosts as myPostsEp,
  myNotifications as myNotificationsEp,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPaging } from "@/types";
import { Chat } from "@/types/chat";
import { PostExtended } from "@/types/post";
import { useMemo } from "react";

export const useGetMyAccountInfo = (config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: myAccountInfo, ...rest } = useQuery<JsendSuccess<UserAccount>>({
    queryKey: keys.meAccount(),
    queryFn: () =>
      request
        .get(myAccountEp, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { myAccountInfo, ...rest };
};

export const useGetMyChats = (
  query?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: myChats, ...rest } = useQuery<JsendWithPaging<Chat[]>>({
    queryKey: [...keys.meChats(), query],
    queryFn: () =>
      request
        .get(myChatsEp(query), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { myChats, ...rest };
};

export const useGetMyPosts = (
  query?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data, ...rest } = useInfiniteQuery<JsendWithPaging<PostExtended[]>>({
    queryKey: [...keys.mePosts(), query],
    queryFn: ({ pageParam }) =>
      pageParam === null
        ? Promise.resolve(undefined)
        : request
            .get(pageParam ? pageParam : myPostsEp(query), config)
            .then((res) => res.data)
            .catch((err) => Promise.reject(err?.response?.data)),
    getNextPageParam: (res) => res?.pagination?.next ?? null,
    getPreviousPageParam: (res) => res?.pagination?.previous ?? null,
  });

  const myPosts = useMemo(
    () => ({
      ...data?.pages?.[0],
      data: data?.pages
        ?.map((page) =>
          (page?.data ?? [])?.filter((data) => data !== undefined)
        )
        .flat(),
    }),
    [data]
  );

  return { myPosts, data, ...rest };
};

export const useGetMyFollowers = (config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: myFollowers, ...rest } = useQuery<
    JsendSuccess<{ followerIds: number[]; total: number }>
  >({
    queryKey: keys.meFollowers(),
    queryFn: () =>
      request
        .get(myFollowersEp, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { myFollowers, ...rest };
};

export const useGetMyFollowedUsers = (config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: myFollowedUsers, ...rest } = useQuery<
    JsendSuccess<{ followedUserIds: number[]; total: number }>
  >({
    queryKey: keys.meFollowing(),
    queryFn: () =>
      request
        .get(myFollowedUsersEp, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { myFollowedUsers, ...rest };
};

export const useGetMyNotifications = (
  query?: OffsetPaging & { order_by?: ("latest" | "oldest")[] },
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: myNotifications, ...rest } = useQuery({
    queryKey: [...keys.meNotifications(), query],
    queryFn: () =>
      request
        .get(myNotificationsEp(query), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { myNotifications, ...rest };
};
