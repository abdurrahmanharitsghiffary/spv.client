import React from "react";
import { Card } from "@nextui-org/card";
import PostPage from "@/components/page/post-page";

export default async function Post({ params }: { params: { postId: string } }) {
  return (
    <Card className="w-full rounded-sm shadow-none mx-0 pb-0 pt-2">
      <PostPage postId={params.postId} />
    </Card>
  );
}
