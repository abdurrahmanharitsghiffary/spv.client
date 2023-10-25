import PostCard from "@/components/post/post-card";
import PostCardSkeleton from "@/components/post/skeleton";
import { PostExtended } from "@/types/post";
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

export default function PostsTab({ posts }: { posts: PostExtended[] }) {
  return (
    <div className="flex flex-col pt-0 gap-2">
      {(posts ?? []).map((post) => (
        <PostCard post={post} key={post?.id} />
      ))}
    </div>
  );
}
