"use client";
import React from "react";
import PostsGridLayout from "../layout/posts-grid-layout";
import PostCard from "./post-card";
import { Post } from "@/types/post";
import PostCardSkeleton from "./skeleton";
import { useGetPostFromFollowedUsers } from "@/lib/api/posts/query";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";

export default function FollowedPosts() {
  const {
    resp,
    isLoading,
    isSuccess,
    isFetchNextNotAvailable,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  } = useGetPostFromFollowedUsers();

  const data = resp?.data ?? [];

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
  });

  return (
    <>
      <PostsGridLayout className="pt-[9px]">
        {isLoading
          ? [1, 2].map((item) => <PostCardSkeleton key={item} />)
          : isSuccess &&
            data.map((post: Post) => <PostCard post={post} key={post.id} />)}
        {isFetchingNextPage && <Spinner className="mx-auto my-4" />}
      </PostsGridLayout>
      <div ref={ref}></div>
    </>
  );
}
