"use client";

import React from "react";
import MenuLayout from "../layout";
import {
  useParticipantMenuActions,
  useParticipantMenuId,
  useParticipantMenuIsOpen,
} from "@/stores/participant-menu-store";
import { BiTrash, BiUser, BiUserMinus, BiUserPlus } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function ParticipantMenu() {
  const participantId = useParticipantMenuId();

  const isOpen = useParticipantMenuIsOpen();
  const { onClose } = useParticipantMenuActions();
  const router = useRouter();

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
    { key: "kick", label: "Remove from group", icon: <BiTrash /> },
    { key: "grant", label: "Make group admin", icon: <BiUserPlus /> },
    { key: "dismiss", label: "Dissmiss as admin", icon: <BiUserMinus /> },
  ];

  return (
    <MenuLayout
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleMenuActions}
      items={menuItems}
    />
  );
}
