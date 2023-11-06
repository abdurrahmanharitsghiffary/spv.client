import CommentEditForm from "@/components/form/comment-edit-form";
import CommentForm from "@/components/form/comment-form";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";

export default function CommentIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full shadow-none mx-0 max-w-lg pt-5 absolute top-0 rounded-none min-h-[100dvh]">
      <CardBody className="p-0 m-0 relative w-full">{children}</CardBody>
      <CommentForm />
      <CommentEditForm />
    </Card>
  );
}
