"use client";
import { useLikeComment, useUnlikeComment } from "@/lib/api/comments/mutation";
import { useGetCommentIsLiked } from "@/lib/api/comments/query";
import { Button } from "@nextui-org/button";
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

export default function CommentLikeButton({
  commentId,
}: {
  commentId: number | undefined;
}) {
  const { resp, isError } = useGetCommentIsLiked(commentId);
  const { likeComment } = useLikeComment();
  const { unlikeComment } = useUnlikeComment();
  const isLiked = resp?.data?.isLiked ?? false;
  const total = resp?.data?.total_likes ?? 0;
  const handleLike = () => {
    if (!commentId) return null;
    if (isLiked) return unlikeComment({ params: { commentId: commentId } });
    return likeComment({ params: { commentId } });
  };

  return (
    <span className="text-xs pl-4 items-center flex gap-1">
      <Button
        isDisabled={isError}
        isIconOnly
        variant="light"
        size="sm"
        radius="full"
        className="w-unit-6 h-unit-6 min-w-unit-6"
        onClick={handleLike}
      >
        {isLiked ? (
          <AiFillHeart size={16} color="#F31260" />
        ) : (
          <AiOutlineHeart size={16} color="#F31260" />
        )}
      </Button>
      {total ?? 0 > 0 ? <span className="font-semibold">{total}</span> : ""}
    </span>
  );
}
