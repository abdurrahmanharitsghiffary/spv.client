"use client";

import {
  commentById,
  commentIsLiked,
  commentLikesById,
  postCommentsByPostId,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPaging, OffsetPagingwithOrder } from "@/types";
import { Comment } from "@/types/comment";
import { AxiosRequestConfig } from "axios";
import { useInfinite, useQ } from "../hooks";
import { UserSimplified } from "@/types/user";
import { IsLikedResponse } from "@/types/response";

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
  const { data: comment, ...rest } = useQ<Comment>({
    url: commentById(commentId.toString()),
    config,
    queryKey: keys.commentById(commentId),
    qConfig: {
      enabled: commentId !== -1 && commentId !== undefined,
    },
  });

  return { comment, ...rest };
};

export const useGetCommentLikes = (
  commentId: number,
  query: OffsetPaging = { offset: 0, limit: 20 },
  config?: AxiosRequestConfig
) => {
  const q = {
    limit: query.limit?.toString() ?? "20",
    offset: query.offset?.toString() ?? "0",
  };

  const { data: resp, ...rest } = useInfinite<UserSimplified>({
    query: q,
    url: commentLikesById(commentId.toString(), query),
    config,
    queryKey: [...keys.commentLikes(commentId), q],
    queryConfig: {
      enabled: commentId > -1,
    },
  });
  return { resp, ...rest };
};

export const useGetCommentIsLiked = (
  commentId: number | undefined,
  config?: AxiosRequestConfig
) => {
  const { data: resp, ...rest } = useQ<IsLikedResponse>({
    url: commentIsLiked((commentId ?? -1).toString()),
    queryKey: keys.commentIsLiked(commentId ?? -1),
    config,
    qConfig: { enabled: commentId !== -1 && commentId !== undefined },
  });

  return { resp, ...rest };
};
