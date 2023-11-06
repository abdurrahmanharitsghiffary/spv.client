import { CardFooter } from "@nextui-org/card";
import React from "react";
import PostActionButton from "./action-button";

export default function PostCardFooter({
  totalComments,
  postId,
  isPostPage,
  isPreview,
}: {
  totalComments: number;
  postId: number;
  isPreview?: boolean;
  isPostPage?: boolean;
}) {
  return (
    <CardFooter className="py-2">
      <PostActionButton
        totalComments={totalComments}
        postId={postId}
        isPostPage={isPostPage}
        isPreview={isPreview}
      />
    </CardFooter>
  );
}
