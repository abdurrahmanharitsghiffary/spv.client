import React from "react";
import PostPage from "@/components/page/post-page";

export default async function Post({
  params = { postId: "-1" },
}: {
  params: { postId: string };
}) {
  return <PostPage postId={params.postId} />;
}
