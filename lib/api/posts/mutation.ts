"use client";
import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
import {
  basePostRoutes,
  mySavedPost,
  mySavedPostsRoute,
  postById,
  postImageByPostAndImageId,
  postImagesByPostId,
  postLikesByPostId,
} from "@/lib/endpoints";
import { getFormData } from "@/lib/getFormData";
import { keys } from "@/lib/queryKey";
import { CreatePostData, UpdatePostDataOptions } from "@/types";
import { JsendSuccess } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useCreatePost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    mutateAsync: createPostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { data: CreatePostData; config?: AxiosRequestConfig }) => {
      const formData = new FormData();
      if (v?.data?.title) formData.append("title", v?.data?.title);
      formData.append("content", v?.data?.content);
      if (v?.data?.images && v?.data?.images?.length > 0) {
        v?.data.images.forEach((image) => formData.append("images", image));
      }
      return request
        .post(basePostRoutes(), formData, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.posts });
      queryClient.invalidateQueries({ queryKey: keys.mePosts() });
      queryClient.invalidateQueries({ queryKey: keys.meAccount() });
    },
  });

  return { createPost, createPostAsync, ...rest };
};

export const useUpdatePost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: updatePost,
    mutateAsync: updatePostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      postId: number;
      data: UpdatePostDataOptions;
      config?: AxiosRequestConfig;
    }) => {
      const formData = getFormData(v.data);
      return request
        .patch(postById(v.postId.toString()), formData, v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onMutate: async (v) => {
      const title = v?.data?.title;
      const content = v?.data?.content;
      const images = v?.data?.images ?? [];
      await queryClient.cancelQueries({ queryKey: keys.postById(v.postId) });
      await queryClient.cancelQueries({ queryKey: keys.posts });
      await queryClient.cancelQueries({ queryKey: keys.mePosts() });

      const post = queryClient.getQueryData(keys.postById(v.postId));
      const posts = queryClient.getQueryData(keys.posts);
      const myPosts = queryClient.getQueryData(keys.mePosts());

      const updatePostOptimistic = (old: any, type: "single" | "multiple") => {
        if (type === "single")
          return {
            ...old,
            data: {
              ...old?.data,
              title: title ? title : old?.title,
              content: content ? content : old?.content,
              images:
                images?.length > 0
                  ? images.map((item) => ({ src: URL.createObjectURL(item) }))
                  : old?.content,
            },
          };
        return {
          ...old,
          title: title ? title : old?.title,
          content: content ? content : old?.content,
          images:
            images?.length > 0
              ? images.map((item) => ({ src: URL.createObjectURL(item) }))
              : old?.content,
        };
      };

      queryClient.setQueryData(keys.postById(v.postId), (old: any) =>
        updatePostOptimistic(old, "single")
      );

      queryClient.setQueryData(keys.posts, (old: any) => ({
        ...old,
        data: (old?.data ?? []).map((item: any) => {
          if (item?.id === v.postId)
            return updatePostOptimistic(item, "multiple");
          return item;
        }),
      }));

      queryClient.setQueryData(keys.mePosts(), (old: any) => ({
        ...old,
        data: (old?.data ?? []).map((item: any) => {
          if (item?.id === v.postId)
            return updatePostOptimistic(item, "multiple");
          return item;
        }),
      }));

      return { post, posts, myPosts, postId: v.postId };
    },
    onError: (err, v, context) => {
      queryClient.setQueryData(
        keys.postById(context?.postId ?? -1),
        context?.post
      );
      queryClient.setQueryData(keys.mePosts(), context?.myPosts);
      queryClient.setQueryData(keys.posts, context?.posts);
    },
    onSettled: (d, e, v) => {
      queryClient.invalidateQueries(keys.postById(v.postId));
      queryClient.invalidateQueries(keys.posts);
      queryClient.invalidateQueries(keys.mePosts());
    },
  });

  return { updatePost, updatePostAsync, ...rest };
};

export const useDeletePost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deletePost,
    mutateAsync: deletePostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { postId: number; config?: AxiosRequestConfig }) => {
      return request
        .delete(postById(v.postId.toString()), v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
    onMutate: async (v) => {
      await queryClient.cancelQueries({ queryKey: keys.postById(v.postId) });
      await queryClient.cancelQueries({ queryKey: keys.posts });
      await queryClient.cancelQueries({ queryKey: keys.mePosts() });
      await queryClient.cancelQueries({ queryKey: keys.meAccount() });

      const myAccount = queryClient.getQueryData(keys.meAccount());
      const post = queryClient.getQueryData(keys.postById(v.postId));
      const posts = queryClient.getQueryData(keys.posts);
      const myPosts = queryClient.getQueryData(keys.mePosts());

      const deletePostOptimistic = (old: any, type: "single" | "multiple") => {
        if (type === "single") return null;
        return old?.filter((item: any) => item?.id !== v.postId);
      };

      queryClient.setQueryData(keys.meAccount(), (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          posts: {
            ...old?.data?.posts,
            total:
              (old?.data?.posts?.total ?? 0) - 1 === -1
                ? 0
                : (old?.data?.posts?.total ?? 0) - 1,
          },
        },
      }));

      queryClient.setQueryData(keys.postById(v.postId), (old: any) =>
        deletePostOptimistic(old, "single")
      );
      queryClient.setQueryData(keys.posts, (old: any) => ({
        ...old,
        data: old?.data?.filter((item: any) =>
          deletePostOptimistic(item, "multiple")
        ),
      }));
      queryClient.setQueryData(keys.mePosts(), (old: any) => ({
        ...old,
        data: old?.data?.filter((item: any) =>
          deletePostOptimistic(item, "multiple")
        ),
      }));

      return { post, myPosts, posts, postId: v.postId };
    },
    onError: (err, v, context) => {
      queryClient.setQueryData(
        keys.postById(context?.postId ?? -1),
        context?.post
      );
      queryClient.setQueryData(keys.mePosts(), context?.myPosts);
      queryClient.setQueryData(keys.posts, context?.posts);
    },
    onSettled: (d, v, ctx) => {
      queryClient.invalidateQueries({ queryKey: keys.postById(ctx.postId) });
      queryClient.invalidateQueries({ queryKey: keys.posts });
      queryClient.invalidateQueries({ queryKey: keys.mePosts() });
    },
  });

  return { deletePost, deletePostAsync, ...rest };
};

export const useLikePost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: likePost,
    mutateAsync: likePostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { postId: number; config?: AxiosRequestConfig }) => {
      return request
        .post(postLikesByPostId(v.postId.toString()), undefined, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
    onMutate: async (v) => {
      await queryClient.cancelQueries({ queryKey: keys.postById(v.postId) });
      await queryClient.cancelQueries({ queryKey: keys.posts });
      await queryClient.cancelQueries({ queryKey: keys.mePosts() });

      const post = queryClient.getQueryData(keys.postById(v.postId));
      const posts = queryClient.getQueryData(keys.posts);
      const myPosts = queryClient.getQueryData(keys.mePosts());

      queryClient.setQueryData(keys.posts, (old: any) => {
        return {
          ...old,
          data: (old?.data ?? []).map((item: any) => {
            if (item.id === v.postId) {
              return { ...item, total_likes: item?.total_likes ?? 0 + 1 };
            }
            return item;
          }),
        };
      });

      queryClient.setQueryData(keys.postById(v.postId), (old: any) => {
        return {
          ...old,
          data: { ...old?.data, total_likes: old?.total_likes ?? 0 + 1 },
        };
      });

      queryClient.setQueryData(keys.mePosts(), (old: any) => {
        return {
          ...old,
          data: (old?.data ?? []).map((post: any) => {
            if (post.id === v.postId) {
              return { ...post, total_likes: post?.total_likes ?? 0 + 1 };
            }
            return post;
          }),
        };
      });

      return { post, postId: v.postId, posts, myPosts };
    },
    onError: (err, v, context) => {
      queryClient.setQueryData(
        keys.postById(context?.postId ?? -1),
        context?.post
      );
      queryClient.setQueryData(keys.mePosts(), context?.myPosts);
      queryClient.setQueryData(keys.posts, context?.posts);
    },
    onSettled: (d, e, v) => {
      queryClient.invalidateQueries(keys.postById(v.postId));
      queryClient.invalidateQueries(keys.posts);
      queryClient.invalidateQueries(keys.mePosts());
    },
  });

  return { likePost, likePostAsync, ...rest };
};

export const useUnlikePost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: unlikePost,
    mutateAsync: unlikePostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { postId: number; config?: AxiosRequestConfig }) => {
      return request
        .delete(postLikesByPostId(v.postId.toString()), v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
    onMutate: async (v) => {
      await queryClient.cancelQueries({ queryKey: keys.postById(v.postId) });
      await queryClient.cancelQueries({ queryKey: keys.posts });
      await queryClient.cancelQueries({ queryKey: keys.mePosts() });

      const post = queryClient.getQueryData(keys.postById(v.postId));
      const posts = queryClient.getQueryData(keys.posts);
      const myPosts = queryClient.getQueryData(keys.mePosts());

      queryClient.setQueryData(keys.posts, (old: any) => ({
        ...old,
        data: (old?.data ?? [])?.map((item: any) => {
          if (item.id === v.postId) {
            return {
              ...item,
              total_likes:
                item?.total_likes ?? 0 - 1 === -1
                  ? 0
                  : item?.total_likes ?? 0 - 1,
            };
          }
          return item;
        }),
      }));

      queryClient.setQueryData(keys.postById(v.postId), (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          total_likes:
            old?.total_likes ?? 0 - 1 === -1 ? 0 : old?.total_likes ?? 0 - 1,
        },
      }));

      queryClient.setQueryData(keys.mePosts(), (old: any) => {
        return {
          ...old,
          data: (old?.data ?? []).map((post: any) => {
            if (post.id === v.postId) {
              return {
                ...post,
                total_likes:
                  post?.total_likes ?? 0 - 1 === -1
                    ? 0
                    : post?.total_likes ?? 0 - 1,
              };
            }
            return post;
          }),
        };
      });

      return { post, postId: v.postId, posts, myPosts };
    },
    onError: (err, v, context) => {
      queryClient.setQueryData(
        keys.postById(context?.postId ?? -1),
        context?.post
      );
      queryClient.setQueryData(keys.mePosts(), context?.myPosts);
      queryClient.setQueryData(keys.posts, context?.posts);
    },
    onSettled: (d, e, v) => {
      queryClient.invalidateQueries(keys.postById(v.postId));
      queryClient.invalidateQueries(keys.mePosts());
      queryClient.invalidateQueries(keys.posts);
    },
  });

  return { unlikePost, unlikePostAsync, ...rest };
};

export const useDeletepostImages = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deleteAllPostImages,
    mutateAsync: deleteAllPostImagesAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { postId: number; config?: AxiosRequestConfig }) => {
      return request
        .delete(postImagesByPostId(v.postId.toString()), v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.postById(v.postId) });
    },
  });

  return { deleteAllPostImages, deleteAllPostImagesAsync, ...rest };
};

export const useDeletePostImage = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deletePostImage,
    mutateAsync: deletePostImageAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      postId: number;
      imageId: number;
      config?: AxiosRequestConfig;
    }) => {
      return request
        .delete(
          postImageByPostAndImageId(v.postId.toString(), v.imageId.toString()),
          v?.config
        )
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.postById(v.postId) });
    },
  });

  return { deletePostImage, deletePostImageAsync, ...rest };
};

export const useSavePost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: savePost,
    mutateAsync: savePostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { postId: number; config?: AxiosRequestConfig }) => {
      return request
        .post(mySavedPostsRoute(), { postId: v.postId }, v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: [...keys.posts, "saved"] });
    },
    onMutate: async (v) => {
      const key = [...keys.posts, "saved", v.postId];
      await queryClient.cancelQueries(key.slice());
      const postIsSaved = queryClient.getQueryData(key.slice());

      queryClient.setQueryData(key.slice(), (old: any) => ({
        ...old,
        data: true,
      }));

      return { postIsSaved };
    },
    onSettled: (data, err, v) => {
      queryClient.invalidateQueries({
        queryKey: [...keys.posts, "saved", v.postId],
      });
    },
    onError: (err, v, ctx) => {
      queryClient.setQueryData(
        [...keys.posts, "saved", v.postId],
        ctx?.postIsSaved
      );
    },
  });

  return { savePost, savePostAsync, ...rest };
};

export const useDeleteSavedPost = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deleteSavedPost,
    mutateAsync: deleteSavedPostAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { postId: number; config?: AxiosRequestConfig }) => {
      return request
        .delete(mySavedPost(v.postId), v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: [...keys.posts, "saved"] });
    },
    onMutate: async (v) => {
      const key = [...keys.posts, "saved", v.postId];
      await queryClient.cancelQueries(key.slice());
      const postIsSaved = queryClient.getQueryData(key.slice());

      queryClient.setQueryData(key.slice(), (old: any) => ({
        ...old,
        data: false,
      }));

      return { postIsSaved };
    },
    onSettled: (data, err, v) => {
      queryClient.invalidateQueries({
        queryKey: [...keys.posts, "saved", v.postId],
      });
    },
    onError: (err, v, ctx) => {
      queryClient.setQueryData(
        [...keys.posts, "saved", v.postId],
        ctx?.postIsSaved
      );
    },
  });

  return { deleteSavedPost, deleteSavedPostAsync, ...rest };
};
