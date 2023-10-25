"use client";
import React from "react";
import MenuLayout from "../layout";
import { useChatMenuIsOpen, useHideChatMenu } from "@/stores/chat-menu-store";
import { BiUser } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function ChatMenu() {
  const router = useRouter();
  const isOpen = useChatMenuIsOpen();
  const onClose = useHideChatMenu();

  return (
    <MenuLayout
      isOpen={isOpen}
      onClose={onClose}
      onAction={(key) => {
        switch (key) {
          case "profile": {
            router.push("/users/1");
          }
        }
      }}
      items={[{ key: "profile", label: "See profile", icon: <BiUser /> }]}
    />
  );
}
