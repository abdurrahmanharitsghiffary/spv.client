import React from "react";
import { CardHeader } from "@nextui-org/card";
import NextLink from "next/link";
import { TypographyP } from "../ui/typography";
import Timestamp from "../timestamp";
import CommentLikeButton from "../button/comment-like-button";
import CommentMenuTrigger from "../menu/comment-menu/trigger";
import { CommentId } from "@/types/comment";

export default function CommentHeader({
  userId,
  username,
  commentId,
  createdAt,
  totalLikes,
}: {
  userId: number | undefined;
  username: string | undefined;
  createdAt: Date | undefined;
  commentId: number | undefined;
  totalLikes: number | undefined;
}) {
  const comment: CommentId =
    (!commentId && commentId !== 0) || (!userId && userId !== 0)
      ? null
      : { authorId: userId, id: commentId };

  return (
    <CardHeader className="pb-0 pt-0 flex justify-between w-full">
      <NextLink
        href={`/users/${userId}`}
        className="flex flex-col truncate max-w-full"
      >
        <TypographyP className="text-sm !leading-[1.50rem] truncate">
          {username}
        </TypographyP>
        <div className="flex gap-1 items-center">
          <Timestamp
            date={createdAt}
            className="text-xs !text-foreground-500 truncate"
          />
          {/* <TypographyMuted className="!text-xs !text-foreground-800"></TypographyMuted> */}
        </div>
      </NextLink>
      <div className="flex gap-2 items-start justify-end">
        <CommentLikeButton commentId={commentId} total={totalLikes} />
        <CommentMenuTrigger comment={comment} />
      </div>
    </CardHeader>
  );
}
