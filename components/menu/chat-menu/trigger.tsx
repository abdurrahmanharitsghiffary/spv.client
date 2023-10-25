import IconButton from "@/components/button/icon-button";
import { useShowChatMenu } from "@/stores/chat-menu-store";
import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function ChatMenuTrigger(props: ButtonProps) {
  const onOpen = useShowChatMenu();

  return (
    <IconButton {...props} onClick={onOpen}>
      <FiMoreVertical />
    </IconButton>
  );
}
