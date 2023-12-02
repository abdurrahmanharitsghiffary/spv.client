"use client";
import { useLikePost, useUnlikePost } from "@/lib/api/posts/mutation";
import { useGetPostIsLiked } from "@/lib/api/posts/query";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/react";
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
  const { likePost } = useLikePost();
  const { unlikePost } = useUnlikePost();
  const { isLiked } = useGetPostIsLiked(postId);
  return (
    <ButtonGroup fullWidth variant="light">
      <Tooltip content="Like">
        <Button
          onClick={() => {
            if (!postId && postId !== 0) return null;
            if (isLiked?.data) return unlikePost({ postId: postId });
            return likePost({ postId: postId });
          }}
        >
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
