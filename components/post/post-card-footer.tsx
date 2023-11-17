import { CardFooter } from "@nextui-org/card";
import React from "react";
import PostActionButton from "./action-button";

export default function PostCardFooter(props: {
  totalComments: number;
  postId: number;
  isPreview?: boolean;
  isPostPage?: boolean;
  totalLikes: number;
}) {
  return (
    <CardFooter className="py-2">
      <PostActionButton {...props} />
    </CardFooter>
  );
}
