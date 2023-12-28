import Link from "next/link";
import React from "react";
import IconButton from "./icon-button";
import { ButtonProps } from "@nextui-org/button";
import { BsChat } from "react-icons/bs";

export default function ChatButton({ ref, ...props }: ButtonProps) {
  return (
    <IconButton as={Link} href="/chats" {...props}>
      <BsChat />
    </IconButton>
  );
}
