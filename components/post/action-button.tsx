"use client";
import { useLikePost, useUnlikePost } from "@/lib/api/posts/mutation";
import { useGetPostIsLiked } from "@/lib/api/posts/query";
import { PostExtended } from "@/types/post";
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
  post,
}: {
  isPostPage?: boolean;
  post: PostExtended | undefined;
  isPreview?: boolean;
}) {
  const { likePost } = useLikePost();
  const { unlikePost } = useUnlikePost();
  const { isLiked } = useGetPostIsLiked(post?.id ?? -1);
  return (
    <ButtonGroup fullWidth variant="light">
      <Tooltip content="Like">
        <Button
          onClick={() => {
            if (isLiked?.data) return unlikePost({ postId: post?.id ?? -1 });
            return likePost({ postId: post?.id ?? -1 });
          }}
        >
          {isLiked?.data ? (
            <FiThumbsUp color="hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-text-opacity)))" />
          ) : (
            <FiThumbsUp />
          )}
          {post?.total_likes ?? 0}
        </Button>
      </Tooltip>
      <Tooltip content="Comment">
        {isPreview ? (
          <Button>
            <BiComment /> {post?.comments?.total ?? 0}
          </Button>
        ) : (
          <Button
            as={Link}
            href={isPostPage ? "#cm9ti2pt" : `/posts/${post?.id}`}
            replace
          >
            <BiComment /> {post?.comments?.total ?? 0}
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
