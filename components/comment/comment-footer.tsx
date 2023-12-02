"use client";
import React from "react";
import { useBreakpoints } from "@/hooks/use-media-query";
import { CardFooter } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useCommentReplyActions } from "@/stores/comment-reply-store";
import { useRouter } from "next/navigation";

export default function CommentFooter({
  onReplyClick,
  level,
  commentId,
  isShow,
  username,
  totalReply,
}: {
  level: number;
  commentId: number | undefined;
  username: string | undefined;
  isShow: boolean;
  onReplyClick: (value: React.SetStateAction<boolean>) => void;
  totalReply: number | undefined;
}) {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { setSelectedCommentReplyId, setSelectedCommentReplyUsername } =
    useCommentReplyActions();

  const childCommentTotal = totalReply ?? 0;

  const levelLimit = (() => {
    if (breakpoints.isXs) return 2;
    if (breakpoints.isSm) return 3;
    if (breakpoints.isMd) return 4;
    return 5;
  })();

  return (
    <CardFooter className="gap-3 pt-1">
      <Link
        as={level > levelLimit ? NextLink : "button"}
        href={level > levelLimit ? `/comments/${commentId}` : ""}
        color="foreground"
        className="text-xs"
        size="sm"
        onClick={() => {
          if (level > levelLimit) return null;
          router.replace("#cm9ti2pt");
          onReplyClick(true);
          setSelectedCommentReplyId(commentId ?? null);
          setSelectedCommentReplyUsername(username ?? "");
        }}
      >
        Reply
      </Link>
      <Link
        underline="hover"
        color="foreground"
        as={level > levelLimit ? NextLink : "button"}
        href={level > levelLimit ? `/comments/${commentId}` : ""}
        size="sm"
        className="text-xs"
        onClick={() => {
          if (level > levelLimit) return null;
          onReplyClick((c) => !c);
        }}
      >
        {isShow
          ? childCommentTotal > 0
            ? "Hide"
            : ""
          : childCommentTotal > 0
          ? `Show ${childCommentTotal} repl${
              childCommentTotal > 1 ? "ies" : "y"
            }`
          : null}
      </Link>
    </CardFooter>
  );
}
