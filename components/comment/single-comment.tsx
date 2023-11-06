import React from "react";
import User from "../user/user";
import { TypographyP } from "../ui/typography";
import CommentMenuTrigger from "../menu/comment-menu/trigger";
import clsx from "clsx";
import CommentLikeButton from "../button/comment-like-button";
import { Comment, CommentId } from "@/types/comment";
import ImageWithPreview from "../image/image-with-preview";

export default function SingleComment({
  comment,
  className,
}: {
  comment: Comment | null;
  className?: string;
}) {
  const cl = clsx(
    "w-full flex flex-col px-4 my-4 justify-center items-start relative",
    className
  );

  const commentId: CommentId = {
    authorId: comment!?.user?.id,
    id: comment!?.id,
  };

  return (
    <div className={cl}>
      <User user={comment?.user} createdAt={comment?.createdAt} />
      {comment?.image && (
        <ImageWithPreview
          removeWrapper
          src={comment?.image?.src}
          radius="sm"
          className="min-w-[150px] mt-4 max-w-[175px] h-auto object-cover"
        />
      )}
      {comment?.comment && <TypographyP>{comment?.comment}</TypographyP>}
      <div className="flex gap-2 justify-between items-center absolute top-0 right-4">
        <CommentLikeButton
          total={comment?.total_likes ?? 0}
          commentId={comment?.id}
        />
        <CommentMenuTrigger comment={commentId} />
      </div>
    </div>
  );
}
