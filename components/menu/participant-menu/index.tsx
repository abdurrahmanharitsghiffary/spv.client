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
import { useConfirm } from "@/stores/confirm-store";
import {
  useAddGroupParticipants,
  useAddGroupParticipantsOptimistic,
  useRemoveParticipants,
  useRemoveParticipantsOptimistic,
} from "@/lib/api/chats/mutation";
import { toast } from "react-toastify";

export default function ParticipantMenu() {
  const participantId = useParticipantMenuId();
  const isOpen = useParticipantMenuIsOpen();
  const { onClose } = useParticipantMenuActions();
  const router = useRouter();
  const { groupId } = useParams();
  const gId = Number(groupId);
  const session = useSession();
  const { participant } = useGetChatRoomParticipant(gId, session?.id ?? -1);
  const { participant: selectedParticipant } = useGetChatRoomParticipant(
    gId,
    participantId
  );
  const confirm = useConfirm();
  const { removeParticipantsAsync } = useRemoveParticipantsOptimistic();
  const { addGroupParticipantsAsync } = useAddGroupParticipantsOptimistic();
  const currentUserRole = participant?.data?.role ?? "user";
  const selectedParticipantRole: ParticipantRole =
    selectedParticipant?.data?.role ?? "user";

  const handleMenuActions = async (key: React.Key) => {
    try {
      switch (key) {
        case "profile": {
          router.push(`/users/${participantId}`);
          return;
        }
        case "delete-z": {
          await confirm({
            confirmColor: "danger",
            confirmLabel: "Remove",
            body: "Are you sure remove this user from group?",
            title: "Remove user",
          });

          await removeParticipantsAsync({
            body: {
              ids: [participantId],
            },
            params: {
              roomId: gId,
            },
          });
          return;
        }
        case "grant": {
          if (!selectedParticipant) return;
          await addGroupParticipantsAsync({
            body: {
              participants: [{ ...selectedParticipant?.data, role: "admin" }],
            },
            params: {
              roomId: gId,
            },
          });
          return;
        }
        case "dismiss-delete": {
          if (!selectedParticipant) return;
          await confirm({
            body: "Demote this user from admin?",
            title: "Demote",
            confirmLabel: "Demote",
          });
          await addGroupParticipantsAsync({
            body: {
              participants: [{ ...selectedParticipant?.data, role: "user" }],
            },
            params: {
              roomId: gId,
            },
          });
          return;
        }
      }
    } catch (err: any) {
      if (err?.message) toast.error(err?.message);
    } finally {
      onClose();
    }
  };

  const menuItems = [
    { key: "profile", label: "See profile", icon: <BiUser /> },
  ];

  const adminItems = [
    ...menuItems,
    { key: "delete-z", label: "Remove from group", icon: <BiTrash /> },
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

// HOW DO WE DISPLAY ROLE OF EACH GROUP PARTICIPANTS??
