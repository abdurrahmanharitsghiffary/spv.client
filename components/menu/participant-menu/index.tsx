"use client";

import React from "react";
import MenuLayout from "../layout";
import {
  useParticipantMenuActions,
  useParticipantMenuId,
  useParticipantMenuIsOpen,
} from "@/stores/participant-menu-store";
import { BiTrash, BiUser, BiUserMinus, BiUserPlus } from "react-icons/bi";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/stores/auth-store";
import { useGetChatRoomParticipant } from "@/lib/api/chats/query";
import { ParticipantRole } from "@/types/chat";

export default function ParticipantMenu() {
  const participantId = useParticipantMenuId();

  const isOpen = useParticipantMenuIsOpen();
  const { onClose } = useParticipantMenuActions();
  const router = useRouter();
  const { groupId } = useParams();
  const session = useSession();
  const { participant } = useGetChatRoomParticipant(
    Number(groupId),
    session?.id ?? -1
  );
  const { participant: selectedParticipant } = useGetChatRoomParticipant(
    Number(groupId),
    participantId
  );
  const currentUserRole = participant?.data.role ?? "user";
  const selectedParticipantRole: ParticipantRole =
    selectedParticipant?.data.role ?? "user";

  const handleMenuActions = (key: React.Key) => {
    switch (key) {
      case "profile": {
        router.push(`/users/${participantId}`);
      }
    }
  };

  const menuItems = [
    { key: "profile", label: "See profile", icon: <BiUser /> },
  ];

  const adminItems = [
    ...menuItems,
    { key: "kick-delete", label: "Remove from group", icon: <BiTrash /> },
  ];

  const isAdminUpdatingAdmin =
    selectedParticipantRole === "admin" && currentUserRole === "admin";

  if (selectedParticipantRole === "user")
    adminItems.push({
      key: "grant",
      label: "Promote to admin",
      icon: <BiUserPlus />,
    });

  if (selectedParticipantRole === "admin")
    adminItems.push({
      key: "dismiss-delete",
      label: "Dissmiss as admin",
      icon: <BiUserMinus />,
    });

  adminItems.sort((a, b) => {
    if (a.key.includes("delete")) return 1;
    if (b.key.includes("delete")) return -1;
    return 1;
  });

  const selectedItems =
    currentUserRole === "user" ||
    isAdminUpdatingAdmin ||
    selectedParticipantRole === "creator"
      ? menuItems
      : adminItems;

  return (
    <MenuLayout
      avatar={selectedParticipant?.data?.avatarImage?.src ?? ""}
      title={selectedParticipant?.data?.fullName ?? ""}
      description={selectedParticipant?.data?.username}
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleMenuActions}
      items={selectedItems}
    />
  );
}
