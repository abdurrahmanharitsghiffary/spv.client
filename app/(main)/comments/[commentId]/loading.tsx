import SingleCommentSkeleton from "@/components/comment/single-comment-skeleton";
import CommentSkeleton from "@/components/comment/skeleton";
import React from "react";

export default function CommentLoading() {
  return (
    <>
      <SingleCommentSkeleton />
      <div className="flex flex-col justify-center items-start p-4 pb-0 w-full">
        {[1].map((item) => (
          <CommentSkeleton key={item} />
        ))}
      </div>
    </>
  );
}
