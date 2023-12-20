import CommentEditForm from "@/components/form/comment-form/edit-form";
import CommentForm from "@/components/form/comment-form";
import { Card } from "@nextui-org/card";
import React from "react";

export default function PostParamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full rounded-sm shadow-none mx-0 pb-0 pt-2">
      {children}
      <CommentForm />
      <CommentEditForm />
    </Card>
  );
}
