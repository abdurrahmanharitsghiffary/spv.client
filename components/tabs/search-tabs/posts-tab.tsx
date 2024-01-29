import PostCard from "@/components/post/post-card";
import PostCardSkeleton from "@/components/post/skeleton";
import { Post } from "@/types/post";
import React from "react";

export function PostTabLoading() {
  return (
    <div className="flex flex-col pt-0 gap-2">
      {[1, 2, 3].map((item) => (
        <PostCardSkeleton key={item} />
      ))}
    </div>
  );
}

export default function PostsTab({ posts }: { posts: Post[] }) {
  if (posts.length < 1)
    return <span className="text-foreground-400 p-4">No post found.</span>;
  return (
    <div className="flex flex-col pt-0 gap-2">
      {(posts ?? []).map((post) => (
        <PostCard post={post} key={post?.id} />
      ))}
    </div>
  );
}
