"use client";
import React, { useCallback } from "react";
import MenuLayout from "../layout";
import {
  useChatMenuActions,
  useChatMenuIsOpen,
} from "@/stores/chat-menu-store";
import { BiUser } from "react-icons/bi";
import { useParams, useRouter } from "next/navigation";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import { useSession } from "@/stores/auth-store";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { GoReport } from "react-icons/go";

export default function ChatMenu() {
  const { chatId } = useParams();
  const router = useRouter();
  const isOpen = useChatMenuIsOpen();
  const { onClose } = useChatMenuActions();
  const { chatRoom, isLoading, isError, isSuccess } = useGetChatRoomById(
    Number(chatId)
  );
  const session = useSession();

  const isGroupChat = chatRoom?.data?.isGroupChat ?? false;

  const user = chatRoom?.data?.participants?.users?.filter(
    (user) => user.id !== session?.id
  );

  const handleMenuActions = useCallback(
    (key: React.Key) => {
      switch (key) {
        case "profile": {
          return router.push(`/users/${user?.[0]?.id}`);
        }
        case "group": {
          return router.push(`/group/${chatId}`);
        }
      }
    },
    [user, chatId]
  );

  if (!user) return null;

  const personalChatItems = [
    { key: "profile", label: "See profile", icon: <BiUser /> },
  ];
  const groupChatItems = [
    {
      key: "group",
      label: "See group details",
      icon: <HiOutlineUserGroup />,
    },
  ];

  const menuItems = isGroupChat ? groupChatItems : personalChatItems;

  menuItems.push({
    key: "report-delete",
    label: `Report ${isGroupChat ? "group" : "user"}`,
    icon: <GoReport />,
  });

  return (
    <MenuLayout
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleMenuActions}
      items={menuItems}
    />
  );
}
