import SingleCommentSkeleton from "@/components/comment/single-comment-skeleton";
import CommentSkeleton from "@/components/comment/skeleton";
import { Divider } from "@nextui-org/divider";
import React from "react";

export default function CommentModalLoading() {
  return (
    <>
      <SingleCommentSkeleton />
      <Divider />
      <div className="flex flex-col justify-center items-start p-4 pb-0">
        {[1].map((item) => (
          <CommentSkeleton key={item} />
        ))}
      </div>
    </>
  );
}
