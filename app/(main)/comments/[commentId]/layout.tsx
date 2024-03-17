import CommentEditForm from "@/components/form/comment-form/edit-form";
import CommentForm from "@/components/form/comment-form";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { commentId: string };
}): Metadata {
  return {
    title: `Comment - ${params.commentId}`,
    category: "Comment",
    keywords: "comment, post comment",
  };
}

export default function CommentIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full shadow-none mx-0 max-w-lg pt-3 absolute top-0 rounded-none min-h-[100dvh]">
      <CardBody className="p-0 m-0 relative w-full">{children}</CardBody>
      <CommentForm />
      <CommentEditForm />
    </Card>
  );
}
