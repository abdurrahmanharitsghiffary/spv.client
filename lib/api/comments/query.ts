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
import { JsendSuccess, JsendWithPaging } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useGetCommentByPostId = (
  postId: number,
  options?: OffsetPagingwithOrder,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: postComments, ...rest } = useQuery<JsendWithPaging<Comment[]>>({
    queryKey: [...keys.postComments(postId), options],
    queryFn: () =>
      request
        .get(postCommentsByPostId(postId.toString(), options), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { postComments, ...rest };
};

export const useGetComment = (
  commentId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: comment, ...rest } = useQuery<JsendSuccess<Comment>>({
    queryKey: keys.commentById(commentId),
    queryFn: () =>
      request
        .get(commentById(commentId.toString()), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });
  return { comment, ...rest };
};

export const useGetCommentLikes = (
  commentId: number,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: commentLikes, ...rest } = useQuery<
    JsendSuccess<CommentLikeResponse>
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

  const { data: isLiked, ...rest } = useQuery<JsendSuccess<boolean>>({
    queryKey: keys.commentIsLiked(commentId ?? -1),
    queryFn: () =>
      request
        .get(commentIsLiked((commentId ?? -1).toString()), config)
        .then((res) => res.data)
        .catch((err) => err?.response?.data),
    enabled: commentId !== undefined,
  });

  return { isLiked, ...rest };
};
