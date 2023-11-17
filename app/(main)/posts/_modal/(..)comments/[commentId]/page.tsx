"use client";
import { Divider } from "@nextui-org/divider";
import React from "react";
import SingleComment from "@/components/comment/single-comment";
import { CommentReply } from "@/components/comment";
import { useBodyOverflowHidden } from "@/hooks/use-body-overflow-hidden";
import { useGetComment } from "@/lib/api/comments/query";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import SingleCommentSkeleton from "@/components/comment/single-comment-skeleton";
import { useParams } from "next/navigation";

export default function CommentModal() {
  const params = useParams();
  const { comment, isError, isLoading, error } = useGetComment(
    Number(params?.commentId)
  );

  useNotFoundRedirect(error, isError);
  useBodyOverflowHidden(true);

  if (isLoading) return <SingleCommentSkeleton />;

  return (
    <>
      <SingleComment comment={comment?.data ?? null} />
      <Divider />
      <div className="flex flex-col justify-center items-start p-4 pb-0">
        {comment?.data?.commentReply?.commentIds?.map((id) => (
          <CommentReply commentId={id} key={id} level={0} />
        ))}
      </div>
    </>
  );
}
