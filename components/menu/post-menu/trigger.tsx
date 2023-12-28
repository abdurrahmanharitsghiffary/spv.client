import IconButton from "@/components/button/icon-button";
import { useShowPostMenu } from "@/stores/post-menu-store";
import { PostId } from "@/types/post";
import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function PostMenuTrigger({
  post,
  ref,
  onClick,
  ...rest
}: { post: PostId } & ButtonProps) {
  const onOpen = useShowPostMenu();

  return (
    <IconButton onClick={() => onOpen(post)} {...rest}>
      <FiMoreVertical />
    </IconButton>
  );
}
