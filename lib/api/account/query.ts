"use client";
import { UserAccount, UserSimplified } from "@/types/user";
import { AxiosRequestConfig } from "axios";
import {
  myAccount as myAccountEp,
  myChats as myChatsEp,
  myFollowedUsers as myFollowedUsersEp,
  myFollowers as myFollowersEp,
  myPosts as myPostsEp,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPaging } from "@/types";
import { PostExtended } from "@/types/post";
import { useInfinite, useQ } from "../hooks";
import { ChatRoom } from "@/types/chat";

export const useGetMyAccountInfo = (config?: AxiosRequestConfig) => {
  const { data: resp, ...rest } = useQ<UserAccount>({
    url: myAccountEp,
    config,
    queryKey: keys.meAccount(),
  });

  return { resp, ...rest };
};

export const useGetMyAssociatedChatRooms = ({
  query = { limit: 20, offset: 0 },
  type = "all",
  q,
  config,
}: {
  q?: string;
  query?: OffsetPaging;
  type?: "all" | "group" | "personal";
  config?: AxiosRequestConfig;
}) => {
  const que = {
    limit: query.limit?.toString() ?? "20",
    offset: query.offset?.toString() ?? "0",
  };

  const { data: chatRooms, ...rest } = useInfinite<ChatRoom>({
    query: { ...que, type, q },
    url: myChatsEp(),
    queryKey: [...keys.meChats(), { ...que, type, q }],
    config,
  });

  return { chatRooms, ...rest };
};

export const useGetMyPosts = (
  query: OffsetPaging = { limit: 20, offset: 0 },
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

export const useGetMyFollowers = (
  query: { limit?: number; offset?: number } = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: { limit: query.limit?.toString(), offset: query.offset?.toString() },
    url: myFollowersEp(query),
    config,
    queryKey: [...keys.meFollowers(), query],
  });

  return { resp, ...rest };
};

export const useGetMyFollowedUsers = (
  query: { limit?: number; offset?: number } = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: { limit: query.limit?.toString(), offset: query.offset?.toString() },
    url: myFollowedUsersEp(query),
    config,
    queryKey: [...keys.meFollowing(), query],
  });

  return { resp, ...rest };
};
