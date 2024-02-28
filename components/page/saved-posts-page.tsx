"use client";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useGetMySavedPosts } from "@/lib/api/posts/query";
import React from "react";
import PostsGridLayout from "../layout/posts-grid-layout";
import PostCardSkeleton from "../post/skeleton";
import PostCard from "../post/post-card";
import { Spinner } from "@nextui-org/spinner";
import { TypographyH3 } from "../ui/typography";

export default function SavedPostsPage() {
  const {
    isFetchNextNotAvailable,
    mySavedPosts,
    isLoading,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
  } = useGetMySavedPosts();

  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isFetching,
    isDisabled: isFetchNextNotAvailable,
  });

  return (
    <PostsGridLayout>
      <TypographyH3 className="px-3 !text-base">
        Saved posts ({mySavedPosts?.pagination?.totalRecords ?? 0})
      </TypographyH3>
      {isLoading
        ? [1, 2, 3].map((item) => <PostCardSkeleton key={item} />)
        : mySavedPosts?.data?.map((post) => (
            <PostCard post={post} key={post?.id} />
          ))}
      {isFetchingNextPage && <Spinner />}
      <div ref={ref} className="w-full"></div>
    </PostsGridLayout>
  );
}
