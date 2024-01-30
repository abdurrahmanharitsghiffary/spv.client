"use client";

import useHistory from "@/hooks/use-history";
import { Link, LinkProps } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import React from "react";
import NextLink from "next/link";
import clsx from "clsx";

export default function CommentBacklink({
  postId,
  ...rest
}: {
  postId: number | undefined;
} & LinkProps) {
  const { className, ...aRest } = rest;
  const history = useHistory();
  const router = useRouter();

  const isPreviousCommentAndPostPage =
    history.prev?.includes("/comments/") || history.prev?.includes("/posts/");

  return (
    <Link
      as={isPreviousCommentAndPostPage ? "button" : NextLink}
      onClick={isPreviousCommentAndPostPage ? router.back : undefined}
      className={clsx("px-4", className)}
      href={isPreviousCommentAndPostPage ? undefined : `/posts/${postId}`}
      {...aRest}
    >
      &laquo;{" "}
      {isPreviousCommentAndPostPage
        ? "Back to previous comment"
        : "Back to original post"}
    </Link>
  );
}
