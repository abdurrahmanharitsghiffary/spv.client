import IconButton from "@/components/button/icon-button";
import { useChatMenuActions } from "@/stores/chat-menu-store";
import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function ChatMenuTrigger({ ref, ...props }: ButtonProps) {
  const { onOpen } = useChatMenuActions();

  return (
    <IconButton {...props} onClick={onOpen}>
      <FiMoreVertical />
    </IconButton>
  );
}
