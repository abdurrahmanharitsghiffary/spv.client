import Link from "next/link";
import React from "react";
import IconButton from "./icon-button";
import { ButtonProps } from "@nextui-org/button";
import MessageBadge from "./message-badge";
import { IoChatboxEllipses } from "react-icons/io5";

export default function ChatButton({ ref, ...props }: ButtonProps) {
  return (
    <IconButton
      variant="solid"
      as={Link}
      className="overflow-visible"
      href="/chats"
      {...props}
    >
      <MessageBadge>
        <IoChatboxEllipses />
      </MessageBadge>
    </IconButton>
  );
}
