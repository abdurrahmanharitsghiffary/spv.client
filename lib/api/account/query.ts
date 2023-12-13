"use client";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { ApiResponseT } from "@/types/response";
import { UserAccount } from "@/types/user";
import { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
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
import { PostExtended } from "@/types/post";
import { useInfinite } from "../hooks";
import { ChatRoom } from "@/types/chat";

export const useGetMyAccountInfo = (config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: myAccountInfo, ...rest } = useQuery<ApiResponseT<UserAccount>>({
    queryKey: keys.meAccount(),
    queryFn: () =>
      request
        .get(myAccountEp, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { myAccountInfo, ...rest };
};

export const useGetMyAssociatedChatRooms = ({
  query = { limit: "20", offset: "0" },
  type = "all",
  q,
  config,
}: {
  q?: string;
  query?: Record<string, any>;
  type?: "all" | "group" | "personal";
  config?: AxiosRequestConfig;
}) => {
  const { data: chatRooms, ...rest } = useInfinite<ChatRoom>({
    query: { ...query, type, q } as Record<string, any>,
    url: myChatsEp(),
    queryKey: [...keys.meChats(), { ...query, type, q }],
    config,
  });

  return { chatRooms, ...rest };
};

export const useGetMyPosts = (
  query?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const { data: myPosts, ...rest } = useInfinite<PostExtended>({
    query: {
      limit: query?.limit?.toString(),
      offset: query?.offset?.toString(),
    },
    url: myPostsEp(query),
    queryKey: [...keys.mePosts(), query],
    config,
  });

  return { myPosts, ...rest };
};

export const useGetMyFollowers = (config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: myFollowers, ...rest } = useQuery<
    ApiResponseT<{ followerIds: number[]; total: number }>
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
    ApiResponseT<{ followedUserIds: number[]; total: number }>
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
