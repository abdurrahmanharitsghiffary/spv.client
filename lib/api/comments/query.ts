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
import { ApiResponseT } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useInfinite } from "../hooks";

export const useGetCommentByPostId = (
  postId: number,
  options: OffsetPagingwithOrder = { limit: 20, offset: 0 },
  config?: AxiosRequestConfig
) => {
  const q: any = {
    limit: options?.limit?.toString(),
    offset: options?.offset?.toString(),
  };

  if (options.order_by) q.order_by = options.order_by;

  const { data: postComments, ...rest } = useInfinite<Comment>({
    query: q,
    config,
    url: postCommentsByPostId(postId.toString(), options),
    queryKey: keys.postComments(postId),
  });

  return { postComments, ...rest };
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
