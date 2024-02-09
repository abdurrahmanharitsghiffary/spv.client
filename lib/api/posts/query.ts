"use client";

import {
  basePostRoutes,
  followedUserPost,
  mySavedPostsRoute,
  postById,
  postIsLiked,
  postIsSaved,
  postLikesByPostId,
  userPost,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPaging } from "@/types";
import { Post } from "@/types/post";
import { AxiosRequestConfig } from "axios";
import { useInfinite, useQ } from "../hooks";
import { UserSimplified } from "@/types/user";
import { IsLikedResponse } from "@/types/response";

export const useGetPosts = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const q = {
    limit: options?.limit?.toString() ?? "20",
    offset: options?.offset?.toString() ?? "0",
  };
  const { data: posts, ...rest } = useInfinite<Post>({
    url: basePostRoutes(options),
    queryKey: [...keys.posts, options],
    config,
    query: q,
  });

  return { posts, ...rest };
};

export const useGetPostById = (postId: number, config?: AxiosRequestConfig) => {
  const { data: post, ...rest } = useQ<Post>({
    url: postById(postId.toString()),
    queryKey: keys.postById(postId),
    config,
    qConfig: {
      enabled: postId !== -1 && postId !== undefined,
    },
  });

  return { post, ...rest };
};

export const useGetPostByUserId = (
  userId: number,
  query: OffsetPaging = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const q = {
    limit: query.limit?.toString() ?? "20",
    offset: query.offset?.toString() ?? "0",
  };

  const { data: posts, ...rest } = useInfinite<Post>({
    queryKey: [...keys.postByUserId(userId), q],
    query: q,
    url: userPost(userId.toString()),
    config,
  });

  return { posts, ...rest };
};

export const useGetPostFromFollowedUsers = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const q = {
    limit: options?.limit?.toString() ?? "20",
    offset: options?.offset?.toString() ?? "0",
  };

  const { data: resp, ...rest } = useInfinite<Post>({
    query: q,
    url: followedUserPost(options),
    queryKey: [...keys.followedUsersPost(), options],
    config,
  });

  return { resp, ...rest };
};

export const useGetPostLikeByPostId = (
  postId: number,
  query: OffsetPaging = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const q = {
    limit: query.limit?.toString() ?? "20",
    offset: query.offset?.toString() ?? "0",
  };

  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: q,
    url: postLikesByPostId(postId.toString(), query),
    queryKey: [...keys.postLikes(postId), query],
    config,
    queryConfig: {
      enabled: postId > -1,
    },
  });

  return { resp, ...rest };
};

export const useGetPostIsLiked = (
  postId: number,
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useQ<IsLikedResponse>({
    queryKey: keys.postIsLiked(Number(postId)),
    url: postIsLiked(postId?.toString()),
    config,
    qConfig: {
      enabled: postId !== -1 && postId !== undefined,
    },
  });

  return { resp, ...rest };
};

export const useGetMySavedPosts = (
  query:
    | { limit?: number | undefined; offset?: number | undefined }
    | undefined = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const q = {
    limit: query?.limit?.toString() ?? "20",
    offset: query?.offset?.toString() ?? "0",
  };

  const { data: mySavedPosts, ...rest } = useInfinite<
    Post & { assignedAt: Date }
  >({
    url: mySavedPostsRoute(query),
    query: q,
    config,
    queryKey: [...keys.savedPosts(), query],
  });

  return { mySavedPosts, ...rest };
};

export const useGetPostIsSaved = (
  postId: number,
  config?: AxiosRequestConfig
) => {
  const { data: isSaved, ...rest } = useQ<boolean>({
    url: postIsSaved(postId),
    config,
    queryKey: keys.postIsSaved(postId),
    qConfig: {
      enabled: postId !== -1 && postId !== undefined,
    },
  });
  return { isSaved, ...rest };
};
