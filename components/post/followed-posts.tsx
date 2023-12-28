"use client";
import React from "react";
import PostsGridLayout from "../layout/posts-grid-layout";
import PostCard from "./post-card";
import { PostExtended } from "@/types/post";
import PostCardSkeleton from "./skeleton";
import { useGetPostFromFollowedUsers } from "@/lib/api/posts/query";

export default function FollowedPosts() {
  const { followedUsersPost, isLoading, isSuccess } =
    useGetPostFromFollowedUsers();

  return (
    <PostsGridLayout className="pt-[9px] !pb-12">
      {isLoading
        ? [1, 2].map((item) => <PostCardSkeleton key={item} />)
        : isSuccess &&
          (followedUsersPost?.data ?? []).map((post: PostExtended) => (
            <PostCard post={post} key={post.id} />
          ))}
    </PostsGridLayout>
  );
}
