import React from "react";
import PostPage from "@/components/page/post-page";
import { Metadata } from "next";

export function generateMetadata({ params }: any): Metadata {
  return {
    title: `Post - ${params?.postId}`,
    keywords: "Posts, Post",
    category: "Posts",
  };
}

export default async function Post({
  params = { postId: "-1" },
}: {
  params: { postId: string };
}) {
  return <PostPage postId={params.postId} />;
}
