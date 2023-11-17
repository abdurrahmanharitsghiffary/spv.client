import React from "react";
import User from "../user/user";
import PostMenuTrigger from "../menu/post-menu/trigger";
import { PostExtended, PostId } from "@/types/post";
import { CardHeader } from "@nextui-org/card";

export default function PostCardHeader({
  createdAt,
  author,
  isPreview,
  postId,
}: {
  createdAt: Date;
  author: PostExtended["author"] | undefined;
  isPreview?: boolean;
  postId: PostId;
}) {
  return (
    <CardHeader className="justify-between">
      <User createdAt={createdAt} user={author} isPreview={isPreview} />
      <PostMenuTrigger post={postId} />
    </CardHeader>
  );
}
