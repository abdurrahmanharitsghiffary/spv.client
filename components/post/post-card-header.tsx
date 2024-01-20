import React from "react";
import User from "../user/user";
import PostMenuTrigger from "../menu/post-menu/trigger";
import { PostExtended, PostId } from "@/types/post";
import { CardHeader } from "@nextui-org/card";
import IconButton from "../button/icon-button";
import { FiMoreVertical } from "react-icons/fi";

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
    <CardHeader className="justify-between w-full max-w-full">
      <User createdAt={createdAt} user={author} isPreview={isPreview} />
      {isPreview ? (
        <IconButton>
          <FiMoreVertical />
        </IconButton>
      ) : (
        <PostMenuTrigger post={postId} />
      )}
    </CardHeader>
  );
}
