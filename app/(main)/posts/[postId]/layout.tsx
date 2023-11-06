import CommentEditForm from "@/components/form/comment-edit-form";
import CommentForm from "@/components/form/comment-form";
import React from "react";

export default function PostParamsLayout({
  children,
}: {
  params: { postId: string };
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CommentForm />
      <CommentEditForm />
    </>
  );
}
