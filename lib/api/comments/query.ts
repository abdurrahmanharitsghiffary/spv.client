"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import {
  commentById,
  commentIsLiked,
  commentLikesById,
  postCommentsByPostId,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPagingwithOrder } from "@/types";
import { Comment, CommentLikeResponse } from "@/types/comment";
import { ApiResponseT, ApiPagingObjectResponse } from "@/types/response";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";

export const useGetCommentByPostId = (
  postId: number,
  options?: OffsetPagingwithOrder,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();
  const { data, ...rest } = useInfiniteQuery<
    ApiPagingObjectResponse<Comment[]>
  >({
    getNextPageParam: (res) => res?.pagination?.next,
    getPreviousPageParam: (res) => res?.pagination?.previous,
    queryKey: keys.postComments(postId),
    queryFn: ({ pageParam }) =>
      pageParam === null
        ? Promise.resolve(undefined)
        : request
            .get(
              pageParam
                ? pageParam
                : postCommentsByPostId(postId.toString(), options),
              config
            )
            .then((res) => res.data)
            .catch((err) => Promise.reject(err?.response?.data)),
  });

  const postComments = useMemo(
    () => ({
      ...data?.pages?.[0],
      data: data?.pages
        ?.map((page) => (page?.data ?? []).filter((data) => data !== undefined))
        .flat(),
    }),
    [data]
  );

  return { postComments, data, ...rest };
};

export const useGetComment = (
  commentId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: comment, ...rest } = useQuery<ApiResponseT<Comment>>({
    queryKey: keys.commentById(commentId),
    queryFn: () =>
      request
        .get(commentById(commentId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    enabled: commentId !== -1 && commentId !== undefined,
  });
  return { comment, ...rest };
};

export const useGetCommentLikes = (
  commentId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: commentLikes, ...rest } = useQuery<
    ApiResponseT<CommentLikeResponse>
  >({
    queryKey: keys.commentLikes(commentId),
    queryFn: () =>
      request
        .get(commentLikesById(commentId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { commentLikes, ...rest };
};

export const useGetCommentIsLiked = (
  commentId: number | undefined,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: isLiked, ...rest } = useQuery<ApiResponseT<boolean>>({
    queryKey: keys.commentIsLiked(commentId ?? -1),
    queryFn: () =>
      request
        .get(commentIsLiked((commentId ?? -1).toString()), config)
        .then((res) => res.data)
        .catch((err) => err?.response?.data),
    enabled: commentId !== -1 && commentId !== undefined,
  });

  return { isLiked, ...rest };
};
