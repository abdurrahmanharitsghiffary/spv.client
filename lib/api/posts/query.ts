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
import { JsendSuccess, JsendWithPaging } from "@/types/response";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";

export const useGetPosts = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: posts, ...rest } = useQuery<JsendWithPaging<PostExtended[]>>({
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

  const { data: post, ...rest } = useQuery<JsendSuccess<PostExtended>>({
    queryKey: keys.postById(postId),
    queryFn: () =>
      request
        .get(postById(postId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { post, ...rest };
};

export const useGetPostByUserId = (
  userId: number,
  query?: { limit?: number; offset?: number },
  config?: AxiosRequestConfig
) => {
  // const { data: posts, ...rest } = useQuery<JsendWithPaging<PostExtended[]>>({
  //   queryKey: [...keys.posts, userId, query, "users"],
  //   queryFn: () =>
  //    request
  //       .get(userPost(userId.toString()), config)
  //       .then((res) => res.data)
  //       .catch((err) => Promise.reject(err?.response?.data)),
  // });
  const request = useAxiosInterceptor();

  const { data, ...rest } = useInfiniteQuery<JsendWithPaging<PostExtended[]>>({
    queryKey: [...keys.posts, userId, query, "users"],
    queryFn: ({ pageParam }) =>
      pageParam === null
        ? Promise.resolve(undefined)
        : request
            .get(pageParam ? pageParam : userPost(userId.toString()), config)
            .then((res) => res.data)
            .catch((err) => Promise.reject(err?.response?.data)),
    getNextPageParam: (res) => res?.pagination?.next ?? null,
    getPreviousPageParam: (res) => res?.pagination?.previous ?? null,
  });
  const posts = useMemo(
    () => ({
      ...data?.pages?.[0],
      data: data?.pages
        ?.map((page) => (page?.data ?? []).filter((data) => data !== undefined))
        .flat(),
    }),
    [data]
  );

  return { data, posts, ...rest };
};

export const useGetPostFromFollowedUsers = (
  options?: OffsetPaging,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: followedUsersPost, ...rest } = useQuery<
    JsendWithPaging<PostExtended[]>
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
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: postLikes, ...rest } = useQuery<JsendSuccess<PostLikeResponse>>(
    {
      queryKey: keys.postLikes(postId),
      queryFn: () =>
        request
          .get(postLikesByPostId(postId.toString()), config)
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
    }
  );

  return { postLikes, ...rest };
};

export const useGetPostIsLiked = (
  postId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: isLiked, ...rest } = useQuery<JsendSuccess<boolean>>({
    queryKey: [...keys.posts, "likes", postId],
    queryFn: () =>
      request
        .get(postIsLiked(postId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { isLiked, ...rest };
};

export const useGetMySavedPosts = (
  query?:
    | { limit?: number | undefined; offset?: number | undefined }
    | undefined,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data, ...rest } = useInfiniteQuery<
    JsendWithPaging<(PostExtended & { assignedAt: Date })[]>
  >({
    queryKey: [...keys.posts, "saved", query],
    queryFn: ({ pageParam }) =>
      pageParam === null
        ? Promise.resolve(undefined)
        : request
            .get(pageParam ? pageParam : mySavedPostsRoute(query), config)
            .then((res) => res.data)
            .catch((err) => Promise.reject(err?.response?.data)),
    getNextPageParam: (res) => res?.pagination?.next ?? null,
    getPreviousPageParam: (res) => res?.pagination?.previous ?? null,
  });

  const mySavedPosts = useMemo(
    () => ({
      ...data?.pages?.[0],
      data: data?.pages
        ?.map((page) => (page?.data ?? []).filter((data) => data !== undefined))
        .flat(),
    }),
    [data]
  );

  return { mySavedPosts, data, ...rest };
};

export const useGetPostIsSaved = (
  postId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: isSaved, ...rest } = useQuery<JsendSuccess<boolean>>({
    queryKey: [...keys.posts, "saved", postId],
    queryFn: () =>
      request
        .get(postIsSaved(postId), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { isSaved, ...rest };
};
