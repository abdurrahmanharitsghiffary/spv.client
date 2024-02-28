"use client";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import {
  basePostRoutes,
  mySavedPostsRoute,
  postImageByPostAndImageId,
  postImagesByPostId,
} from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { CreatePostData } from "@/types";
import {
  ApiPagingObjectResponse,
  ApiResponseT,
  IsLikedResponse,
} from "@/types/response";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useMutate, useOptimistic } from "../hooks";
import { produce } from "immer";
import { Post } from "@/types/post";
import { UserAccount } from "@/types/user";
import { useParams } from "next/navigation";
type UpdatePostOptions = {
  content?: string;
  title?: string;
  images?: File[];
};

type InfinitePost = InfiniteData<ApiPagingObjectResponse<Post[]>>;
type PostResponse = ApiResponseT<Post>;

export const useCreatePost = () => {
  const {
    mutate: createPost,
    mutateAsync: createPostAsync,
    ...rest
  } = useMutate<CreatePostData>({
    baseUrl: basePostRoutes(),
    method: "post",
    invalidateTags: (v) => [
      keys.posts,
      keys.followedUsersPost(),
      keys.mePosts(),
      keys.meAccount(),
    ],
  });

  return { createPost, createPostAsync, ...rest };
};

const updatePostOptimistic = (
  oldData: InfinitePost | PostResponse,
  body: (UpdatePostOptions & { postId: number }) | undefined
) =>
  produce(oldData, (draft) => {
    if (Array.isArray(oldData)) {
      if ((draft as any)?.pages) {
        (draft as InfinitePost).pages.forEach((p, pi) => {
          p.data.forEach((post, di) => {
            if (post.id === body?.postId) {
              (draft as InfinitePost).pages[pi].data[di].title =
                body.title ?? post.title;
              (draft as InfinitePost).pages[pi].data[di].content =
                body.content ?? post.content;
              (draft as InfinitePost).pages[pi].data[di].images =
                body.images?.map((image) => ({
                  id: image.size + Date.now(),
                  src: URL.createObjectURL(image),
                })) ?? post.images;
              (draft as InfinitePost).pages[pi].data[di].title =
                body.title ?? post.title;
            }
          });
        });
      }
    } else if (typeof draft === "object") {
      const postResp = draft as PostResponse;
      if (
        (draft as PostResponse)?.data &&
        (draft as PostResponse).data.id === body?.postId
      ) {
        (draft as PostResponse).data.title = body.title ?? postResp.data.title;
        (draft as PostResponse).data.content =
          body.content ?? postResp.data.content;
        (draft as PostResponse).data.images =
          body.images?.map((image) => ({
            id: image.size + Date.now(),
            src: URL.createObjectURL(image),
          })) ?? postResp.data.images;
      }
    }
  });

export const useUpdatePost = () => {
  const {
    optimistic: updatePost,
    optimisticAsync: updatePostAsync,
    ...rest
  } = useOptimistic<UpdatePostOptions, { postId: number }>({
    method: "patch",
    baseUrl: basePostRoutes() + "/:postId",
    invalidateTags: (v) => [["search"]],
    optimisticUpdater: (v) => {
      const params = v?.params;
      const body = { ...v?.body, postId: Number(params?.postId) };

      return [
        {
          queryKey: keys.postById(Number(params?.postId)),
          updater: (oldData) => updatePostOptimistic(oldData, body),
        },
        {
          queryKey: keys.posts,
          updater: (oldData) => updatePostOptimistic(oldData, body),
          isInfiniteData: true,
        },
        {
          queryKey: keys.mePosts(),
          updater: (oldData) => updatePostOptimistic(oldData, body),
        },
      ];
    },
  });

  return {
    updatePost,
    updatePostAsync,
    ...rest,
  };
};

const deletePostOptimistic = (oldData: InfinitePost, postId: number) =>
  produce(oldData, (draft) => {
    if (draft?.pages) {
      draft.pages.forEach((p, pi) => {
        p.data.forEach((d, di) => {
          if (d.id === postId) {
            draft.pages[pi].data = draft.pages[pi].data.filter(
              (item) => item.id !== postId
            );
            draft.pages[pi].pagination.totalRecords -= 1;
            draft.pages[pi].pagination.resultCount -= 1;
          }
        });
      });
    }
  });

export const useDeletePost = () => {
  const {
    optimistic: deletePost,
    optimisticAsync: deletePostAsync,
    ...rest
  } = useOptimistic<undefined, { postId: number }>({
    baseUrl: basePostRoutes() + "/:postId",
    method: "delete",
    invalidateTags: (v) => [["search"]],
    optimisticUpdater: (v) => {
      const postId = Number(v.params?.postId);
      return [
        {
          queryKey: keys.postById(postId),
          updater: <OD extends PostResponse | undefined>(oldData: OD): OD =>
            produce(oldData, (draft) => {
              if (draft?.data.id === postId) {
                draft = undefined as any;
              }
            }),
        },
        {
          queryKey: keys.posts,
          updater: (oldData) => deletePostOptimistic(oldData, postId),
        },
        {
          queryKey: keys.mePosts(),
          updater: (oldData) => deletePostOptimistic(oldData, postId),
        },
        {
          queryKey: keys.meAccount(),
          updater: <OD extends ApiResponseT<UserAccount>>(oldData: OD): OD =>
            produce(oldData, (draft) => {
              if (draft.data) {
                const totalPost = draft.data.count.posts;
                draft.data.count.posts += totalPost > 0 ? -1 : 0;
              }
            }),
        },
      ];
    },
  });

  return { deletePost, deletePostAsync, ...rest };
};

const updateLikePost = <OD extends InfinitePost>(
  oldData: OD,
  postId: number,
  isSearchAllType?: boolean
): OD =>
  produce(oldData, (draft) => {
    if (draft?.pages) {
      draft.pages.forEach((p, pi) => {
        if (p?.data && !isSearchAllType) {
          p.data.forEach((post, poi) => {
            if (post.id === postId) {
              draft.pages[pi].data[poi].totalLikes += 1;
            }
          });
        } else if (isSearchAllType) {
          if ((p as any)?.data?.posts?.data instanceof Array) {
            (p as any)?.data?.posts?.data?.forEach((d: any, di: number) => {
              if (d.id === postId) {
                (draft as any).pages[pi].data.posts.data[di].totalLikes += 1;
              }
            });
          }
        }
      });
    }
  });

const updateUnlikePost = <OD extends InfinitePost>(
  oldData: OD,
  postId: number,
  isSearchAllType?: boolean
): OD =>
  produce(oldData, (draft) => {
    if (draft?.pages) {
      draft.pages.forEach((p, pi) => {
        if (p?.data && !isSearchAllType) {
          p.data.forEach((post, poi) => {
            if (post.id === postId) {
              const totalLikes = draft.pages[pi].data[poi].totalLikes;
              if (totalLikes > 0) {
                draft.pages[pi].data[poi].totalLikes -= 1;
              }
            }
          });
        } else if (isSearchAllType) {
          if ((p as any)?.data?.posts?.data instanceof Array) {
            (p as any)?.data?.posts?.data?.forEach((d: any, di: number) => {
              if (d.id === postId) {
                if (
                  ((draft as any)?.pages?.[pi]?.data?.posts?.data?.[di]
                    ?.totalLikes ?? 0) > 0
                )
                  (draft as any).pages[pi].data.posts.data[di].totalLikes -= 1;
              }
            });
          }
        }
      });
    }
  });

export const useLikePost = () => {
  const {
    optimistic: likePost,
    optimisticAsync: likePostAsync,
    ...rest
  } = useOptimistic<undefined, { postId: number }>({
    baseUrl: basePostRoutes() + "/:postId/likes",
    method: "post",
    optimisticUpdater(v) {
      const postId = Number(v.params?.postId)!;
      return [
        // {
        //   queryKey: ["search"],
        //   queryFilters: {
        //     predicate: (query) =>
        //       query.queryKey[0] === "search" &&
        //       ["post", "all"].includes(
        //         (query.queryKey?.[1] as any)?.type ?? ""
        //       ),
        //   },
        //   isInfiniteData: true,
        //   updater(oldData) {
        //     console.log(oldData, "Old Data Search");
        //     if (oldData?.pages?.[0]?.data instanceof Array) {
        //       return updateLikePost(oldData, postId);
        //     }
        //     return updateLikePost(oldData, postId, true);
        //   },
        // },
        // {
        //   queryKey: keys.mePosts(),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateLikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.postByUserId(uId),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateLikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.followedUsersPost(),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateLikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.savedPosts(),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateLikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.postById(postId),
        //   updater: <OD extends ApiResponseT<Post>>(oldData: OD): OD =>
        //     produce(oldData, (draft) => {
        //       if (draft?.data) {
        //         draft.data.totalLikes += 1;
        //       }
        //     }),
        // },
        {
          queryKey: keys.postIsLiked(postId),
          updater: <OD extends ApiResponseT<IsLikedResponse>>(
            oldData: OD
          ): OD =>
            produce(oldData, (draft) => {
              if (draft.data) {
                draft.data.isLiked = true;
                draft.data.totalLikes += 1;
              }
            }),
        },
      ];
    },
  });

  return { likePost, likePostAsync, ...rest };
};

export const useUnlikePost = () => {
  const {
    optimistic: unlikePost,
    optimisticAsync: unlikePostAsync,
    ...rest
  } = useOptimistic<undefined, { postId: number }>({
    baseUrl: basePostRoutes() + "/:postId/likes",
    method: "delete",
    optimisticUpdater(v) {
      const postId = Number(v.params?.postId)!;
      return [
        // {
        //   queryKey: ["search"],
        //   queryFilters: {
        //     predicate: (query) =>
        //       query.queryKey[0] === "search" &&
        //       ["post", "all"].includes(
        //         (query.queryKey?.[1] as any)?.type ?? ""
        //       ),
        //   },
        //   isInfiniteData: true,
        //   updater(oldData) {
        //     console.log(oldData, "Old Data Search");
        //     if (oldData?.pages?.[0]?.data instanceof Array) {
        //       return updateUnlikePost(oldData, postId);
        //     }
        //     return updateUnlikePost(oldData, postId, true);
        //   },
        // },
        // {
        //   queryKey: keys.mePosts(),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateUnlikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.postByUserId(uId),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateUnlikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.followedUsersPost(),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateUnlikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.savedPosts(),
        //   isInfiniteData: true,
        //   updater: (oldData) => updateUnlikePost(oldData, postId),
        // },
        // {
        //   queryKey: keys.postById(postId),
        //   updater: <OD extends ApiResponseT<Post>>(oldData: OD): OD =>
        //     produce(oldData, (draft) => {
        //       if (draft?.data) {
        //         if (draft.data.totalLikes > 0) {
        //           draft.data.totalLikes -= 1;
        //         }
        //       }
        //     }),
        // },
        {
          queryKey: keys.postIsLiked(postId),
          updater: <OD extends ApiResponseT<IsLikedResponse>>(
            oldData: OD
          ): OD =>
            produce(oldData, (draft) => {
              if (draft.data) {
                draft.data.isLiked = false;
                if ((draft.data.totalLikes ?? 0) > 0)
                  draft.data.totalLikes -= 1;
              }
            }),
        },
      ];
    },
  });

  return { unlikePost, unlikePostAsync, ...rest };
};

export const useSavePost = () => {
  const {
    optimistic: savePost,
    optimisticAsync: savePostAsync,
    ...rest
  } = useOptimistic<{ postId: number }>({
    baseUrl: mySavedPostsRoute(),
    method: "post",
    optimisticUpdater: (v) => {
      const postId = Number(v.body?.postId);
      return [
        {
          queryKey: keys.postIsSaved(postId),
          updater: (oldData) => ({ ...oldData, data: true }),
        },
      ];
    },
    invalidateTags: (v) => [keys.savedPosts()],
  });

  return { savePost, savePostAsync, ...rest };
};

export const useDeleteSavedPost = () => {
  const {
    optimistic: deleteSavedPost,
    optimisticAsync: deleteSavedPostAsync,
    ...rest
  } = useOptimistic<undefined, { postId: number }>({
    baseUrl: mySavedPostsRoute() + "/:postId",
    method: "delete",
    optimisticUpdater: (v) => {
      const postId = Number(v.params?.postId);
      return [
        {
          queryKey: keys.postIsSaved(postId),
          updater: (oldData) => ({ ...oldData, data: false }),
        },
      ];
    },
    invalidateTags: (v) => [keys.savedPosts()],
  });

  return { deleteSavedPost, deleteSavedPostAsync, ...rest };
};

// NU
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
        .then((res) => res.data as ApiResponseT<null>)
        .catch((err) => Promise.reject(err?.response));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.postById(v.postId) });
    },
  });

  return { deleteAllPostImages, deleteAllPostImagesAsync, ...rest };
};

// NU
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
        .then((res) => res.data as ApiResponseT<null>)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.postById(v.postId) });
    },
  });

  return { deletePostImage, deletePostImageAsync, ...rest };
};
