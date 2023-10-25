import PostsGridLayout from "@/components/layout/posts-grid-layout";
import PostCardSkeleton from "@/components/post/skeleton";
import React from "react";

export default function HomeLoading() {
  return (
    <PostsGridLayout className="pt-[9px]">
      {[1, 2].map((item) => (
        <PostCardSkeleton key={item} />
      ))}
    </PostsGridLayout>
  );
}
