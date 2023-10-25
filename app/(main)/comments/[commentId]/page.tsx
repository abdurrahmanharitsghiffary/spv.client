"use client";

import React from "react";
import { CommentReply } from "@/components/comment";
import { Divider } from "@nextui-org/divider";
import SingleComment from "@/components/comment/single-comment";
import { useGetComment } from "@/lib/api/comments/query";
import SingleCommentSkeleton from "@/components/comment/single-comment-skeleton";
import CommentSkeleton from "@/components/comment/skeleton";

export default function CommentPage({
  params,
}: {
  params: { commentId: string };
}) {
  const { comment, isLoading, isSuccess } = useGetComment(
    Number(params.commentId)
  );

  return (
    <>
      {isLoading ? (
        <SingleCommentSkeleton />
      ) : (
        isSuccess && <SingleComment comment={comment?.data ?? null} />
      )}
      <Divider />
      <div className="flex flex-col justify-center items-start p-4 pb-0 w-full">
        {isLoading
          ? [1, 2, 3].map((item) => <CommentSkeleton key={item} />)
          : isSuccess &&
            comment?.data?.commentReply?.commentIds?.map((id) => (
              <CommentReply commentId={id} key={id} level={0} />
            ))}
      </div>
    </>
  );
}
