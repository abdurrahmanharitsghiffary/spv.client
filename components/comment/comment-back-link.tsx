"use client";

import useHistory from "@/hooks/use-history";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import React from "react";
import NextLink from "next/link";

export default function CommentBacklink({
  postId,
}: {
  postId: number | undefined;
}) {
  const history = useHistory();
  const router = useRouter();

  const isPreviousCommentAndPostPage =
    history.prev?.includes("/comments/") || history.prev?.includes("/posts/");

  return (
    <Link
      as={isPreviousCommentAndPostPage ? "button" : NextLink}
      onClick={isPreviousCommentAndPostPage ? router.back : undefined}
      className="px-4"
      href={isPreviousCommentAndPostPage ? undefined : `/posts/${postId}`}
    >
      &laquo;{" "}
      {isPreviousCommentAndPostPage
        ? "Back to previous comment"
        : "Back to original post"}
    </Link>
  );
}
