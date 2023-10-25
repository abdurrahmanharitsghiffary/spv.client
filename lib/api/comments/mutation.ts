"use client";

import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
import {
  baseCommentRoutes,
  commentById,
  commentLikesById,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { CreateCommentData } from "@/types";
import { JsendSuccess } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useParams } from "next/navigation";

export const useCreateComment = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: createComment,
    mutateAsync: createCommentAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      data: CreateCommentData;
      config?: AxiosRequestConfig;
    }) => {
      const formData = new FormData();

      if (v.data?.image) formData.append("image", v.data.image);
      if (v.data?.imageSrc) formData.append("imageSrc", v.data.imageSrc);
      if (v.data?.parentId)
        formData.append("parentId", v.data.parentId.toString());
      formData.append("comment", v.data.comment);
      formData.append("postId", v.data.postId.toString());
      return request
        .post(baseCommentRoutes, formData, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      // queryClient.invalidateQueries({ queryKey: keys.posts });
      queryClient.invalidateQueries({ queryKey: keys.postById(v.data.postId) });
      queryClient.invalidateQueries({
        queryKey: keys.postComments(v.data.postId),
      });
    },
  });

  return { createComment, createCommentAsync, ...rest };
};

export const useCreateReplyComment = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: createReplyComment,
    mutateAsync: createReplyCommentAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      commentId: number;
      comment: string;
      image?: File;
      imageSrc?: string;
      config?: AxiosRequestConfig;
    }) => {
      const formData = new FormData();
      formData.append("commentId", v.commentId.toString());
      formData.append("comment", v.comment);
      if (v?.image) formData.append("image", v.image);
      if (v?.imageSrc) formData.append("imageSrc", v?.imageSrc);
      return request
        .post(commentById(v.commentId.toString()), formData, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    // NEED FIX??
    onSuccess: (d, v) => {
      // queryClient.invalidateQueries({
      //   queryKey: keys.commentById(v.commentId),
      // });
      queryClient.invalidateQueries({
        queryKey: ["comment"],
      });
      queryClient.invalidateQueries({
        queryKey: keys.postById(d?.data?.postId),
      });
      queryClient.invalidateQueries({
        queryKey: keys.postComments(d?.data?.postId),
      });
    },
  });

  return { createReplyComment, createReplyCommentAsync, ...rest };
};
// NEED FIX INVALIDATING TOTAL COMMENT COUNTS
export const useDeleteComment = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();
  const { postId, commentId } = useParams();

  const {
    mutate: deleteComment,
    mutateAsync: deleteCommentAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { commentId: number; config?: AxiosRequestConfig }) => {
      return request
        .delete(commentById(v.commentId.toString()), v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });

      queryClient.invalidateQueries({ queryKey: keys.comments });
      if (postId)
        queryClient.invalidateQueries({
          queryKey: keys.postComments(Number(postId)),
        });
    },
  });

  return { deleteComment, deleteCommentAsync, ...rest };
};

export const useUpdateComment = () => {
  const { postId, commentId } = useParams();
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: updateComment,
    mutateAsync: updateCommentAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      commentId: number;
      comment: string;
      config?: AxiosRequestConfig;
    }) => {
      return request
        .patch(
          commentById(v.commentId.toString()),
          { comment: v?.comment },
          v?.config
        )
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: keys.commentById(v.commentId),
      });
      if (postId)
        queryClient.invalidateQueries({
          queryKey: keys.postComments(Number(postId)),
        });
      if (commentId)
        queryClient.invalidateQueries({
          queryKey: keys.commentById(Number(commentId)),
        });
    },
  });

  return { updateComment, updateCommentAsync, ...rest };
};

export const useLikeComment = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();
  const {
    mutate: likeComment,
    mutateAsync: likeCommentAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { commentId: number; config?: AxiosRequestConfig }) =>
      request
        .post(commentLikesById(v.commentId.toString()), undefined, v?.config)
        .then((res) => res.data)
        .catch((err) => err?.response?.data),
    onMutate: async (v) => {
      await queryClient.cancelQueries(keys.commentIsLiked(v.commentId));
      await queryClient.cancelQueries(keys.commentById(v.commentId));
      await queryClient.cancelQueries(keys.post);

      const comment = queryClient.getQueryData(keys.commentById(v.commentId));
      const commentIsLiked = queryClient.getQueryData(
        keys.commentIsLiked(v.commentId)
      );
      const comments = queryClient.getQueriesData(keys.post);

      queryClient.setQueryData(
        keys.commentIsLiked(v.commentId),
        (old: any) => ({
          ...old,
          data: true,
        })
      );

      queryClient.setQueriesData(keys.post, (old: any) => {
        if (old?.data instanceof Array) {
          return {
            ...old,
            data: old?.data?.map((item: any) => {
              if (item?.id === v.commentId) {
                return {
                  ...item,
                  total_likes: (item?.total_likes ?? 0) + 1,
                };
              }
              if (item?.commentReply?.comments) {
                return {
                  ...item,
                  commentReply: {
                    ...item?.commentReply,
                    comments: item?.commentReply?.comments?.map((it: any) => {
                      if (it?.id === v.commentId)
                        return {
                          ...it,
                          total_likes: (it?.total_likes ?? 0) + 1,
                        };
                      return it;
                    }),
                  },
                };
              }
              return item;
            }),
          };
        }
      });

      queryClient.setQueryData(keys.commentById(v.commentId), (old: any) => {
        return {
          ...old,
          data: {
            ...old?.data,
            total_likes: (old?.data?.total_likes ?? 0) + 1,
          },
        };
      });

      return { comment, commentIsLiked, comments };
    },
    onError: (e, v, ctx) => {
      queryClient.setQueryData(
        keys.commentIsLiked(v.commentId),
        ctx?.commentIsLiked
      );
      queryClient.setQueryData(keys.commentById(v.commentId), ctx?.comment);
      queryClient.setQueriesData(keys.post, ctx?.comments);
    },
    onSettled: (d, v, ctx) => {
      queryClient.invalidateQueries(keys.commentIsLiked(ctx.commentId));
      queryClient.invalidateQueries(keys.commentById(ctx.commentId));
      queryClient.invalidateQueries(keys.post);
    },
  });

  return { likeComment, likeCommentAsync, ...rest };
};

export const useUnlikeComment = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();
  const {
    mutate: unlikeComment,
    mutateAsync: unlikeCommentAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { commentId: number; config?: AxiosRequestConfig }) =>
      request
        .delete(commentLikesById(v.commentId.toString()), v?.config)
        .then((res) => res.data)
        .catch((err) => err?.response?.data),
    onMutate: async (v) => {
      await queryClient.cancelQueries(keys.commentIsLiked(v.commentId));
      await queryClient.cancelQueries(keys.commentById(v.commentId));
      await queryClient.cancelQueries(keys.post);

      const comment = queryClient.getQueryData(keys.commentById(v.commentId));
      const commentIsLiked = queryClient.getQueryData(
        keys.commentIsLiked(v.commentId)
      );
      const comments = queryClient.getQueriesData(keys.post);

      queryClient.setQueryData(
        keys.commentIsLiked(v.commentId),
        (old: any) => ({
          ...old,
          data: false,
        })
      );

      queryClient.setQueriesData(keys.post, (old: any) => {
        if (old?.data instanceof Array) {
          return {
            ...old,
            data: old?.data?.map((item: any) => {
              if (item?.id === v.commentId) {
                return {
                  ...item,
                  total_likes:
                    (item?.total_likes ?? 0) - 1 === -1
                      ? 0
                      : (item?.total_likes ?? 0) - 1,
                };
              }
              if (item?.commentReply?.comments) {
                return {
                  ...item,
                  commentReply: {
                    ...item?.commentReply,
                    comments: item?.commentReply?.comments?.map((it: any) => {
                      if (it?.id === v.commentId)
                        return {
                          ...it,
                          total_likes:
                            (it?.total_likes ?? 0) - 1 === -1
                              ? 0
                              : (it?.total_likes ?? 0) - 1,
                        };
                      return it;
                    }),
                  },
                };
              }
              return item;
            }),
          };
        }
      });

      queryClient.setQueryData(keys.commentById(v.commentId), (old: any) => {
        return {
          ...old,
          data: {
            ...old?.data,
            total_likes:
              (old?.data?.total_likes ?? 0) - 1 === -1
                ? 0
                : (old?.data?.total_likes ?? 0) - 1,
          },
        };
      });

      return { comment, commentIsLiked, comments };
    },
    onError: (e, v, ctx) => {
      queryClient.setQueriesData(keys.post, ctx?.comments);
      queryClient.setQueryData(
        keys.commentIsLiked(v.commentId),
        ctx?.commentIsLiked
      );
      queryClient.setQueryData(keys.commentById(v.commentId), ctx?.comment);
    },
    onSettled: (d, v, ctx) => {
      queryClient.invalidateQueries(keys.commentIsLiked(ctx.commentId));
      queryClient.invalidateQueries(keys.post);
      queryClient.invalidateQueries(keys.commentById(ctx.commentId));
    },
  });

  return { unlikeComment, unlikeCommentAsync, ...rest };
};
