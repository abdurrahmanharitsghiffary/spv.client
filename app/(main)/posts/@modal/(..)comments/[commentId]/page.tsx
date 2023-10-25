"use client";
import { Divider } from "@nextui-org/divider";
import { useRouter } from "next/navigation";
import React from "react";
import SingleComment from "@/components/comment/single-comment";
import { CommentReply } from "@/components/comment";
import { useBodyOverflowHidden } from "@/hooks/useBodyOverflowHidden";
import { useGetComment } from "@/lib/api/comments/query";

export default function CommentModal({
  params,
}: {
  params: { commentId: string };
}) {
  const router = useRouter();
  const { comment, isError, isLoading } = useGetComment(
    Number(params?.commentId)
  );

  useBodyOverflowHidden(true);

  if (isLoading || isError) return null;

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
