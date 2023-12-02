"use client";
import React from "react";
import MenuLayout from "../layout";
import {
  useChatMenuActions,
  useChatMenuIsOpen,
} from "@/stores/chat-menu-store";
import { BiUser } from "react-icons/bi";
import { useParams, useRouter } from "next/navigation";

export default function ChatMenu() {
  const { chatId } = useParams();
  const router = useRouter();
  const isOpen = useChatMenuIsOpen();
  const { onClose } = useChatMenuActions();

  if (!chatId) return null;

  return (
    <MenuLayout
      isOpen={isOpen}
      onClose={onClose}
      onAction={(key) => {
        switch (key) {
          case "profile": {
            router.push(`/profile/${chatId}`);
          }
        }
      }}
      items={[{ key: "profile", label: "See profile", icon: <BiUser /> }]}
    />
  );
}
