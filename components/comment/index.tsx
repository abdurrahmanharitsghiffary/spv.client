"use client";
import React, { useMemo, useRef, useState } from "react";
import { Card } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { Comment as CommentType } from "@/types/comment";
import { useGetComment } from "@/lib/api/comments/query";
import CommentSkeleton from "./skeleton";
import CommentHeader from "./comment-header";
import CommentBody from "./comment-body";
import CommentFooter from "./comment-footer";

function Comment({
  comment,
  className,
  level = 0,
}: {
  comment: CommentType | null;
  className?: string;
  level?: number;
}) {
  const [isShow, setIsShow] = useState(false);
  // USE MEMO ??
  const containerRef = useRef<HTMLDivElement>(null);

  const style = `${
    level > 0 ? "border-l" : ""
  } rounded-none dark:border-[#FFFFFF26] border-[rgba(18, 18, 18, 0.15)] shadow-none pl-4 ml-5 w-full ${
    className ?? ""
  }`;

  // USE MEMO ??
  const commentIds = comment?.replies?.ids ?? [];

  const handleReplyClick = (value: React.SetStateAction<boolean>) => {
    setIsShow(value);
  };

  // const onSuccessLoad = useCallback((isSuccess: boolean) => {
  // }, []);

  return (
    <div className="flex gap-2 relative py-2 w-full" ref={containerRef}>
      <Avatar
        as={NextLink}
        href={`/users/${comment?.user?.id}`}
        name={comment?.user?.username}
        src={comment?.user?.avatarImage?.src}
        className="absolute"
      />
      {level > 1 && (
        <span className="absolute top-[20px] w-[10%] h-[1px] bg-divider -left-[20px]"></span>
      )}

      <Card className={style}>
        <CommentHeader
          commentId={comment?.id}
          createdAt={comment?.createdAt}
          totalLikes={comment?.total_likes}
          userId={comment?.user?.id}
          username={comment?.user?.username}
        />
        <CommentBody
          comment={comment?.comment}
          imageSrc={comment?.image?.src}
        />
        <CommentFooter
          commentId={comment?.id}
          isShow={isShow}
          level={level}
          onReplyClick={handleReplyClick}
          totalReply={comment?.replies?.total}
          username={comment?.user?.username}
        />
        {isShow && commentIds?.length > 0 && (
          <CommentReplies
            // onSuccessLoadReply={onSuccessLoad}
            level={level}
            commentIds={commentIds}
          />
        )}
      </Card>
    </div>
  );
}
export default Comment;

export function CommentReply({
  commentId,
  level,
}: // onSuccessLoad,
{
  commentId: number;
  level?: number;
  // onSuccessLoad?: (isSuccess: boolean) => void;
}) {
  const { isLoading, isSuccess, comment } = useGetComment(commentId);

  // useEffect(() => {
  //   if (onSuccessLoad && isSuccess) onSuccessLoad(isSuccess);
  // }, [isSuccess]);

  if (isLoading) return <CommentSkeleton level={level} />;
  if (isSuccess)
    return <Comment comment={comment?.data ?? null} level={level} />;
  return null;
}

export function CommentReplies({
  commentIds = [],
  level,
}: // onSuccessLoadReply,
{
  commentIds?: number[];
  level: number;
  // onSuccessLoadReply?: (isSuccess: boolean) => void;
}) {
  const [limit, setLimit] = useState(10);
  // const [isSuccessAll, setIsSuccessAll] = useState<boolean[]>([]);
  // const isSuccess =
  //   isSuccessAll.every((val) => val === true) && isSuccessAll.length === limit;

  // useEffect(() => {
  //   if (onSuccessLoadReply) onSuccessLoadReply(isSuccess);
  // }, [isSuccess]);

  // const onSuccessLoad = useCallback((isSuccess: boolean) => {
  //   setIsSuccessAll((c) => [...c, isSuccess]);
  // }, []);

  const isOlderCommentAvailable =
    commentIds.length > 10 && commentIds.length - limit >= 0;

  const ids = useMemo(() => {
    const reversedIds = commentIds.slice().reverse() ?? [];
    if (!isOlderCommentAvailable) return reversedIds;
    return (reversedIds ?? []).length > 0
      ? reversedIds.slice(
          reversedIds.length - limit < 0 ? 0 : reversedIds.length - limit
        )
      : [];
  }, [commentIds, limit, isOlderCommentAvailable]);

  const handleShowOlderComments = () => {
    if (limit <= commentIds.length && isOlderCommentAvailable)
      return setLimit((c) => c + 10);
  };

  return (
    <>
      {isOlderCommentAvailable && (
        <Link
          underline="hover"
          color="foreground"
          as={"button"}
          size="sm"
          className="text-xs mb-4"
          onClick={handleShowOlderComments}
        >
          Show older comments
        </Link>
      )}
      {(ids ?? []).map((id) => (
        <CommentReply
          // onSuccessLoad={onSuccessLoad}
          level={level + 1}
          commentId={id}
          key={id}
        />
      ))}
    </>
  );
}

// const handleScrollBottom = useCallback(() => {
//   const element = containerRef.current;
//   if (element) {
//     element.scrollIntoView({
//       behavior: "auto",
//       block: "end",
//       inline: "end",
//     });
//   }
// }, [containerRef]);

// const handleScrollTop = useCallback(() => {
//   const element = containerRef.current;
//   if (element) {
//     element.scrollIntoView({
//       behavior: "auto",
//       block: "start",
//       inline: "start",
//     });
//   }
// }, [containerRef]);

// useEffect(() => {
//   if (isShow) {
//     handleScrollBottom();
//   }

//   // return () => {
//   //   if (isShow) handleScrollTop();
//   // };
// }, [isShow, handleScrollBottom]);
