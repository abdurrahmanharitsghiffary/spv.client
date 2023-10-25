import PostsGridLayout from "@/components/layout/posts-grid-layout";
import PostCardSkeleton from "@/components/post/skeleton";
import React from "react";

export default function SavedLoading() {
  return (
    <PostsGridLayout>
      {[1, 2, 3].map((item) => (
        <PostCardSkeleton key={item} />
      ))}
    </PostsGridLayout>
  );
}
