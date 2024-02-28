"use client";

import React from "react";
import { CommentReply } from "@/components/comment";
import { Divider } from "@nextui-org/divider";
import SingleComment from "@/components/comment/single-comment";
import { useGetComment } from "@/lib/api/comments/query";
import SingleCommentSkeleton from "@/components/comment/single-comment-skeleton";
import CommentSkeleton from "@/components/comment/skeleton";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import CommentBacklink from "@/components/comment/comment-back-link";

export default function CommentPage({
  params = { commentId: "-1" },
}: {
  params: { commentId: string };
}) {
  const { comment, isLoading, isSuccess, isError, error } = useGetComment(
    Number(params.commentId)
  );

  useNotFoundRedirect(error, isError);

  return (
    <>
      <CommentBacklink className="pt-4" postId={comment?.data?.postId} />
      {isLoading ? (
        <SingleCommentSkeleton />
      ) : (
        isSuccess && <SingleComment comment={comment?.data ?? null} />
      )}
      <Divider />
      <div className="flex flex-col justify-center items-start p-4 w-full">
        {isLoading
          ? [1, 2, 3].map((item) => <CommentSkeleton key={item} />)
          : isSuccess &&
            comment?.data?.replies?.map((id) => (
              <CommentReply commentId={id} key={id} level={0} />
            ))}
      </div>
    </>
  );
}
