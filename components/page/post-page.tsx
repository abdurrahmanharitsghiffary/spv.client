"use client";
import React, { useEffect } from "react";
import PostCard from "../post/post-card";
import { Divider } from "@nextui-org/divider";
import Comment from "../comment";
import { useGetPostById } from "@/lib/api/posts/query";
import { useGetCommentByPostId } from "@/lib/api/comments/query";
import CommentSkeleton from "../comment/skeleton";
import PostCardSkeleton from "../post/skeleton";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

export default function PostPage({ postId }: { postId: string }) {
  const { post, isLoading, isSuccess, isError, error, fetchStatus } =
    useGetPostById(Number(postId));
  const isSSR = useIsSSR();
  const {
    postComments,
    isFetching,
    isFetchNextNotAvailable,
    isFetchingNextPage,
    fetchNextPage,
    isSuccess: isCommentSuccess,
    isLoading: isCommentLoading,
  } = useGetCommentByPostId(Number(postId));

  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isDisabled: isFetchNextNotAvailable,
    isFetching,
  });

  useEffect(() => {
    const element = document.getElementById("main-container");
    if (!element) return;
    element.classList.remove("pt-14");
    return () => {
      element.classList.add("pt-14");
    };
  }, []);

  const comments = postComments?.data ?? [];

  useNotFoundRedirect(error, isError, postId === "-1" || postId === undefined);

  return (
    <div className={clsx("w-full h-full", !isSSR ? "pt-16" : "pt-2")}>
      {isLoading ? (
        <PostCardSkeleton />
      ) : (
        isSuccess && (
          <PostCard post={post?.data} className="px-0 shadow-none" isPostPage />
        )
      )}
      <Divider />
      <div className="flex mx-4 flex-col mt-4">
        {isCommentLoading
          ? [1, 2, 3].map((item) => <CommentSkeleton key={item} />)
          : isCommentSuccess &&
            comments.map((comment) => (
              <Comment comment={comment} key={comment.id} />
            ))}
        {isFetchingNextPage && <Spinner className="my-4" />}
        <div className="w-full" ref={ref}></div>
      </div>
    </div>
  );
}
