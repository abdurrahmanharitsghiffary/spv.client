"use client";
import { Button } from "@nextui-org/button";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useShowCommentMenu } from "@/stores/comment-menu-store";
import clsx from "clsx";
import { CommentId } from "@/types/comment";

export default function CommentMenuTrigger({
  comment,
  className,
}: {
  comment: CommentId;
  className?: string;
}) {
  const onOpen = useShowCommentMenu();
  const cl = clsx("w-unit-6 h-unit-6 min-w-unit-6", className);

  return (
    <Button
      isIconOnly
      onClick={() => onOpen(comment)}
      radius="full"
      variant="light"
      size="sm"
      className={cl}
    >
      <FiMoreVertical size={16} />
    </Button>
  );
}
