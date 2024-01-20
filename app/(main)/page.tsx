import FollowSuggestion from "@/components/follow-suggestion";
import CreatePostForm from "@/components/form/create-post-form";
import PostsGridLayout from "@/components/layout/posts-grid-layout";
import FollowedPosts from "@/components/post/followed-posts";
import React from "react";

export default async function HomePage() {
  return (
    <PostsGridLayout className="pt-[9px]">
      <CreatePostForm isNotPostPage withPreview={false} autoFocus={false} />
      <FollowSuggestion />
      <FollowedPosts />
    </PostsGridLayout>
  );
}
