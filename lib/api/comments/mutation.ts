"use client";

import { baseCommentRoutes } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { CreateCommentData } from "@/types";
import { Comment } from "@/types/comment";
import { ApiPagingObjectResponse, ApiResponseT } from "@/types/response";
import { InfiniteData } from "@tanstack/react-query";
import { produce } from "immer";
import { useParams } from "next/navigation";
import { useMutate, useOptimistic } from "../hooks";

type CreateReplyCommentData = {
  commentId: number;
  comment: string;
  image?: File;
  imageSrc?: string;
};

export const useCreateComment = () => {
  const {
    mutate: createComment,
    mutateAsync: createCommentAsync,
    ...rest
  } = useMutate<CreateCommentData>({
    baseUrl: baseCommentRoutes,
    method: "post",
    invalidateTags: (v) => {
      const postId = Number(v?.body?.postId);
      return [keys.postById(postId), keys.postComments(postId)];
    },
  });

  return { createComment, createCommentAsync, ...rest };
};

export const useCreateReplyComment = () => {
  const {
    mutate: createReplyComment,
    mutateAsync: createReplyCommentAsync,
    ...rest
  } = useMutate<CreateReplyCommentData, { commentId: number }>({
    baseUrl: baseCommentRoutes + "/:commentId",
    method: "post",
    invalidateTags: (v, d) => {
      const postId = Number(d.data?.postId);
      return [keys.comment, keys.postById(postId), keys.postComments(postId)];
    },
  });

  return { createReplyComment, createReplyCommentAsync, ...rest };
};
// NEED FIX INVALIDATING TOTAL COMMENT COUNTS
export const useDeleteComment = () => {
  const { postId } = useParams();

  const {
    mutate: deleteComment,
    mutateAsync: deleteCommentAsync,
    ...rest
  } = useMutate<undefined, { commentId: number }>({
    baseUrl: baseCommentRoutes + "/:commentId",
    method: "delete",
    invalidateTags: (v) => {
      return [keys.comment, keys.postComments(Number(postId))];
    },
  });

  return { deleteComment, deleteCommentAsync, ...rest };
};

export const useUpdateComment = () => {
  const { postId, commentId } = useParams();

  const {
    mutate: updateComment,
    mutateAsync: updateCommentAsync,
    ...rest
  } = useMutate<{ comment: string }, { commentId: number }>({
    baseUrl: baseCommentRoutes + "/:commentId",
    method: "patch",
    invalidateTags: (v) => {
      return [
        keys.postComments(Number(postId)),
        keys.commentById(Number(v.params?.commentId)),
        keys.commentById(Number(commentId)),
      ];
    },
  });

  return { updateComment, updateCommentAsync, ...rest };
};

type InfinitePagingPostComents = InfiniteData<
  ApiPagingObjectResponse<Comment[]>
>;

const updateCommentLike = <OD extends ApiResponseT<Comment>>(
  oldData: OD,
  commentId: number,
  isLiked: boolean
): OD =>
  produce(oldData, (draft) => {
    if ((draft as unknown as InfinitePagingPostComents)?.pages) {
      (draft as unknown as InfinitePagingPostComents).pages.forEach((p, pi) => {
        p.data.forEach((d, di) => {
          if (d.id === commentId) {
            (draft as unknown as InfinitePagingPostComents).pages[pi].data[
              di
            ].total_likes += isLiked ? 1 : d.total_likes > 0 ? -1 : 0;
            (draft as unknown as InfinitePagingPostComents).pages[pi].data[
              di
            ].isLiked = isLiked;
          }
        });
      });
    }
    if (draft?.data) {
      if (draft.data instanceof Array) {
        draft.data.forEach((d: Comment, di) => {
          if (d.id === commentId) {
            (draft.data as any)[di].total_likes += isLiked
              ? 1
              : d.total_likes > 0
              ? -1
              : 0;
            (draft.data as any)[di].isLiked = isLiked;
          }
        });
      } else if (typeof draft.data === "object") {
        if (draft.data.id === commentId) {
          draft.data.total_likes += isLiked
            ? 1
            : draft.data.total_likes > 0
            ? -1
            : 0;
          draft.data.isLiked = isLiked;
        }
      }
    }
  });

const updateCommentIsLiked = <OD extends ApiResponseT<boolean>>(
  oldData: OD,
  isLiked: boolean
): OD =>
  produce(oldData, (draft) => {
    if (draft?.data !== undefined) {
      draft.data = isLiked;
    }
  });

export const useLikeComment = () => {
  const {
    optimistic: likeComment,
    optimisticAsync: likeCommentAsync,
    ...rest
  } = useOptimistic<undefined, { commentId: number }>({
    baseUrl: baseCommentRoutes + "/:commentId/likes",
    method: "post",
    optimisticUpdater(v) {
      const commentId = Number(v?.params?.commentId);
      return [
        {
          queryKey: keys.commentIsLiked(commentId),
          updater: (oldData) => updateCommentIsLiked(oldData, true),
        },
        {
          queryKey: keys.comment,
          isInfiniteData: true,
          updater: (oldData) => updateCommentLike(oldData, commentId, true),
        },
      ];
    },
  });

  return { likeComment, likeCommentAsync, ...rest };
};

export const useUnlikeComment = () => {
  const {
    optimistic: unlikeComment,
    optimisticAsync: unlikeCommentAsync,
    ...rest
  } = useOptimistic<undefined, { commentId: number }>({
    baseUrl: baseCommentRoutes + "/:commentId/likes",
    method: "delete",

    optimisticUpdater(v) {
      const commentId = Number(v?.params?.commentId);
      return [
        {
          queryKey: keys.commentIsLiked(commentId),
          updater: (oldData) => updateCommentIsLiked(oldData, false),
        },
        {
          queryKey: keys.comment,
          isInfiniteData: true,
          updater: (oldData) => updateCommentLike(oldData, commentId, false),
        },
      ];
    },
  });

  return { unlikeComment, unlikeCommentAsync, ...rest };
};
