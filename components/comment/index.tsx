"use client";
import React, { useMemo, useState } from "react";
import { CardFooter, Card, CardBody, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { TypographyMuted, TypographyP } from "../ui/typography";
import Timestamp from "../timestamp";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useSetReplyId } from "@/hooks/useReply";
import { useRouter } from "next/navigation";
import CommentMenu from "../menu/comment-menu";
import CommentMenuProvider from "../menu/comment-menu/context/comment-menu-context";
import CommentMenuTrigger from "../menu/comment-menu/trigger";
import CommentLikeButton from "../button/comment-like-button";
import { useBreakpoints } from "@/hooks/useMediaQuery";
import ImageWithPreview from "../image/image-with-preview";
import {
  Comment as CommentType,
  CommentReply as CommentReplyType,
} from "@/types/comment";
import { useGetComment } from "@/lib/api/comments/query";
import CommentSkeleton from "./skeleton";

export default function Comment({
  comment,
  className,
  level = 0,
}: {
  comment: CommentType | null;
  className?: string;
  level?: number;
}) {
  const breakpoints = useBreakpoints();
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const setReplyId = useSetReplyId();

  const commentData = useMemo(() => comment, [comment]);

  const style = `${
    level > 0 ? "border-l" : ""
  } rounded-none dark:border-[#FFFFFF26] border-[rgba(18, 18, 18, 0.15)] shadow-none pl-4 ml-5 w-full ${
    className ?? ""
  }`;

  const isUpdated = comment?.updateAt !== comment?.createdAt;

  const levelLimit = (() => {
    if (breakpoints.isXs) return 2;
    if (breakpoints.isSm) return 3;
    if (breakpoints.isMd) return 4;
    return 5;
  })();

  const childCommentTotal = commentData?.commentReply?.total ?? 0;
  // const commentReply = useMemo(
  //   () => (commentData as CommentType)?.commentReply?.comments ?? [],
  //   [commentData]
  // );
  const commentIds = useMemo(
    () => (commentData as CommentReplyType)?.commentReply?.commentIds ?? [],
    [commentData]
  );

  return (
    <CommentMenuProvider>
      <div className="flex gap-2 relative">
        <Avatar
          as={NextLink}
          href={`/users/${commentData?.user?.id}`}
          name={commentData?.user?.username}
          src={commentData?.user?.image?.src}
          className="absolute"
        />
        {level > 1 && (
          <span className="absolute top-[20px] w-[10%] h-[1px] bg-divider -left-[20px]"></span>
        )}

        <Card className={style}>
          <CardHeader className="pb-0 pt-0 flex justify-start w-full">
            <NextLink
              href={`/users/${commentData?.user?.id}`}
              className="flex flex-col"
            >
              <TypographyP className="font-semibold text-sm !leading-[1.50rem]">
                {commentData?.user?.username}
              </TypographyP>
              <div className="flex gap-1 items-center">
                <Timestamp date={commentData?.createdAt} className="text-xs" />
                <TypographyMuted className="!text-xs !text-foreground-800">
                  {isUpdated && "(updated)"}
                </TypographyMuted>
              </div>
            </NextLink>
            <div className="flex gap-2 items-start justify-end">
              <CommentLikeButton
                commentId={commentData?.id}
                total={commentData?.total_likes}
              />
              <CommentMenuTrigger comment={commentData as CommentType} />
            </div>
          </CardHeader>
          <CardBody className="text-sm p-0 my-3 w-fit max-w-full rounded-lg ml-[0.8rem] shadow-[0_0_7px_-1px_rgba(0,0,0,0)] pr-3">
            {commentData?.image && (
              <ImageWithPreview
                removeWrapper
                src={commentData?.image?.src}
                radius="sm"
                className="min-w-[150px] max-w-[175px] h-auto my-1 object-cover"
              />
            )}
            {commentData?.comment}
          </CardBody>
          <CardFooter className="gap-3 pt-1">
            <Link
              as={level > levelLimit ? NextLink : "button"}
              href={level > levelLimit ? `/comments/${commentData?.id}` : ""}
              color="foreground"
              className="text-xs"
              size="sm"
              onClick={() => {
                if (level > levelLimit) return null;
                router.replace("#cm9ti2pt");
                setIsShow(true);
                setReplyId({
                  username: commentData?.user?.username ?? "",
                  id: commentData?.id ?? -1,
                });
              }}
            >
              Reply
            </Link>
            <Link
              underline="hover"
              color="foreground"
              as={level > levelLimit ? NextLink : "button"}
              href={level > levelLimit ? `/comments/${commentData?.id}` : ""}
              size="sm"
              className="text-xs"
              onClick={() => {
                if (level > levelLimit) return null;
                setIsShow((c) => !c);
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
          {isShow &&
            commentIds?.length > 0 &&
            commentIds.map((id) => (
              <CommentReply level={level + 1} key={id} commentId={id} />
            ))}
        </Card>
      </div>
      <CommentMenu />
    </CommentMenuProvider>
  );
}

export function CommentReply({
  commentId,
  level,
}: {
  commentId: number;
  level?: number;
}) {
  const { isLoading, isSuccess, comment } = useGetComment(commentId);
  if (isLoading) return <CommentSkeleton level={level} />;
  if (isSuccess)
    return <Comment comment={comment?.data ?? null} level={level} />;
  return null;
}
