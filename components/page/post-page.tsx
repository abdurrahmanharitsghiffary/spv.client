"use client";
import React from "react";
import PostCard from "../post/post-card";
import { Divider } from "@nextui-org/divider";
import Comment from "../comment";
import { useGetPostById } from "@/lib/api/posts/query";
import { useGetCommentByPostId } from "@/lib/apiv2";
import CommentSkeleton from "../comment/skeleton";
import PostCardSkeleton from "../post/skeleton";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";

export default function PostPage({ postId }: { postId: string }) {
  const { post, isLoading, isSuccess } = useGetPostById(Number(postId));
  const {
    postComments,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    isSuccess: isCommentSuccess,
    isLoading: isCommentLoading,
  } = useGetCommentByPostId(Number(postId));
  const isDisabled = (data?.pageParams ?? []).some((params) => params === null);
  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isDisabled,
    isFetching,
  });
  return (
    <>
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
            (postComments?.data ?? []).map((comment) => (
              <Comment comment={comment} key={comment.id} />
            ))}
        {isFetchingNextPage && <Spinner className="my-4" />}
        <div className="w-full" ref={ref}></div>
      </div>
    </>
  );
}
