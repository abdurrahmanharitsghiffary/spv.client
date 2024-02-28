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
  useRemoveParticipants,
  useUpdateParticipants,
} from "@/lib/api/chats/mutation";
import MemberRole from "@/components/group/member-role";

export default function ParticipantMenu() {
  const participantId = useParticipantMenuId();
  const isOpen = useParticipantMenuIsOpen();
  const { onClose } = useParticipantMenuActions();
  const router = useRouter();
  const { groupId } = useParams();
  const gId = Number(groupId);
  const session = useSession();
  const { participant, isLoading: isLoadCurrentUser } =
    useGetChatRoomParticipant(gId, session?.id ?? -1);
  const { participant: selectedParticipant, isLoading } =
    useGetChatRoomParticipant(gId, participantId);
  const confirm = useConfirm();
  const { updateParticipantsAsync } = useUpdateParticipants();
  const { removeParticipantsAsync } = useRemoveParticipants();
  const currentUserRole = participant?.data?.role ?? "user";
  const selectedParticipantRole: ParticipantRole =
    selectedParticipant?.data?.role ?? "user";

  const handleMenuActions = async (key: React.Key) => {
    switch (key) {
      case "profile": {
        router.push(`/users/${participantId}`);
        return;
      }
      case "z-delete": {
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
            groupId: gId,
          },
        });
        return;
      }
      case "grant": {
        if (!selectedParticipant) return;
        await confirm({
          title: "Promote",
          body: "Promote this user to admin?",
        });
        await updateParticipantsAsync({
          body: {
            participants: [{ id: selectedParticipant.data.id, role: "admin" }],
          },
          params: {
            groupId: gId,
          },
        });
        return;
      }
      case "dismiss-delete": {
        if (!selectedParticipant) return;
        await confirm({
          body: "Dismiss this user from admin?",
          title: "Dismiss",
          confirmLabel: "Dismiss",
          confirmColor: "danger",
        });
        await updateParticipantsAsync({
          body: {
            participants: [{ id: selectedParticipant.data.id, role: "user" }],
          },
          params: {
            groupId: gId,
          },
        });
        return;
      }
    }
  };

  const menuItems = [
    { key: "profile", label: "See profile", icon: <BiUser /> },
  ];

  const adminItems = [...menuItems];

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

  adminItems.push({
    key: "z-delete",
    label: "Remove from group",
    icon: <BiTrash />,
  });

  const selectedItems =
    currentUserRole === "user" ||
    isAdminUpdatingAdmin ||
    selectedParticipantRole === "creator"
      ? menuItems
      : adminItems;

  return (
    <MenuLayout
      isLoading={isLoading || isLoadCurrentUser}
      shouldToastWhenActionError
      avatar={selectedParticipant?.data?.avatarImage?.src ?? ""}
      title={
        <div className="flex justify-between">
          <span className="flex-1 pr-2 truncate">
            {selectedParticipant?.data?.fullName ?? ""}
          </span>
          <MemberRole
            className="flex-shrink-0"
            role={selectedParticipant?.data?.role ?? "user"}
          />
        </div>
      }
      description={selectedParticipant?.data?.username}
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleMenuActions}
      items={selectedItems}
    />
  );
}

// HOW DO WE DISPLAY ROLE OF EACH GROUP PARTICIPANTS??
