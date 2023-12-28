"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
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
import { PostExtended, PostLikeResponse } from "@/types/post";
import { ApiResponseT, ApiPagingObjectResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useInfinite } from "../hooks";
import { UserSimplified } from "@/types/user";

export const useGetPosts = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: posts, ...rest } = useQuery<
    ApiPagingObjectResponse<PostExtended[]>
  >({
    queryKey: [...keys.posts, options],
    queryFn: () =>
      request
        .get(basePostRoutes(options), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { posts, ...rest };
};

export const useGetPostById = (postId: number, config?: AxiosRequestConfig) => {
  const request = useAxiosInterceptor();

  const { data: post, ...rest } = useQuery<ApiResponseT<PostExtended>>({
    queryKey: keys.postById(postId),
    queryFn: () =>
      request
        .get(postById(postId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    enabled: postId !== -1 && postId !== undefined,
  });

  return { post, ...rest };
};

export const useGetPostByUserId = (
  userId: number,
  query: { limit?: number; offset?: number } = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: posts, ...rest } = useInfinite<PostExtended>({
    queryKey: [...keys.posts, userId, query, "users"],
    query: query ?? {},
    url: userPost(userId.toString()),
    config,
  });

  return { posts, ...rest };
};

export const useGetPostFromFollowedUsers = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: followedUsersPost, ...rest } = useQuery<
    ApiPagingObjectResponse<PostExtended[]>
  >({
    queryKey: [...keys.posts, options],
    queryFn: () =>
      request
        .get(followedUserPost(options), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { followedUsersPost, ...rest };
};

export const useGetPostLikeByPostId = (
  postId: number,
  query: { offset?: number; limit?: number } = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: { limit: query.limit?.toString(), offset: query.offset?.toString() },
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
  const request = useAxiosInterceptor();

  const { data: isLiked, ...rest } = useQuery<ApiResponseT<boolean>>({
    queryKey: [...keys.posts, "likes", postId],
    queryFn: () =>
      request
        .get(postIsLiked(postId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    enabled: postId !== -1 && postId !== undefined,
  });

  return { isLiked, ...rest };
};

export const useGetMySavedPosts = (
  query:
    | { limit?: number | undefined; offset?: number | undefined }
    | undefined = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const { data: mySavedPosts, ...rest } = useInfinite<
    PostExtended & { assignedAt: Date }
  >({
    url: mySavedPostsRoute(query),
    query: {
      limit: query?.limit?.toString(),
      offset: query?.offset?.toString(),
    },
    config,
    queryKey: [...keys.posts, "saved", query],
  });

  return { mySavedPosts, ...rest };
};

export const useGetPostIsSaved = (
  postId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: isSaved, ...rest } = useQuery<ApiResponseT<boolean>>({
    queryKey: [...keys.posts, "saved", postId],
    queryFn: () =>
      request
        .get(postIsSaved(postId), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    enabled: postId !== -1 && postId !== undefined,
  });

  return { isSaved, ...rest };
};
