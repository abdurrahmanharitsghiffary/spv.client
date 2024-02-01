"use client";
import { useLikePost, useUnlikePost } from "@/lib/api/posts/mutation";
import { useGetPostIsLiked } from "@/lib/api/posts/query";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import Link from "next/link";
import React from "react";
import { BiComment } from "react-icons/bi";
import { FiThumbsUp } from "react-icons/fi";
import { PiPaperPlaneTilt } from "react-icons/pi";

export default function PostActionButton({
  isPostPage,
  isPreview,
  postId,
  totalComments,
  totalLikes,
}: {
  isPostPage?: boolean;
  postId: number;
  totalComments: number;
  totalLikes: number;
  isPreview?: boolean;
}) {
  const { likePostAsync } = useLikePost();
  const { unlikePostAsync } = useUnlikePost();
  const { isLiked } = useGetPostIsLiked(postId);

  const handlePostLike = async () => {
    if ((!postId && postId !== 0) || isPreview || isLiked?.data === undefined)
      return null;
    if (isLiked.data) {
      await unlikePostAsync({ params: { postId } });
    } else {
      await likePostAsync({ params: { postId } });
    }
  };

  return (
    <ButtonGroup fullWidth variant="light">
      <Tooltip content="Like">
        <Button onClick={handlePostLike}>
          {isLiked?.data ? (
            <FiThumbsUp color="hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-text-opacity)))" />
          ) : (
            <FiThumbsUp />
          )}
          {totalLikes ?? 0}
        </Button>
      </Tooltip>
      <Tooltip content="Comment">
        {isPreview ? (
          <Button>
            <BiComment /> {totalComments ?? 0}
          </Button>
        ) : (
          <Button
            as={Link}
            href={isPostPage ? "#cm9ti2pt" : `/posts/${postId}`}
            replace={isPostPage ?? false}
          >
            <BiComment /> {totalComments ?? 0}
          </Button>
        )}
      </Tooltip>
      <Tooltip content="Share">
        <Button>
          <PiPaperPlaneTilt />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}
