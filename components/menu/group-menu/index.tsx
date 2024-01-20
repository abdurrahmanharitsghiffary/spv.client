"use client";

import React from "react";
import MenuLayout from "../layout";
import { useParams } from "next/navigation";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineGroup } from "react-icons/md";
import { FiEdit, FiTrash } from "react-icons/fi";
import { GoReport } from "react-icons/go";
import {
  useGroupMenuActions,
  useGroupMenuIsOpen,
} from "@/stores/group-menu-store";
import { notifyToast } from "@/lib/toast";
import { useGroupJoin } from "@/hooks/use-group-join";
import { useEditGroupActions } from "@/stores/edit-group-store";
import { useDeleteGroupChat } from "@/lib/api/chats/mutation";
import { useConfirm } from "@/stores/confirm-store";

export default function GroupMenu() {
  const isOpen = useGroupMenuIsOpen();
  const { onClose } = useGroupMenuActions();
  const { groupId } = useParams();
  const gId = Number(groupId);
  const { onOpen } = useEditGroupActions();
  const { deleteGroupChatAsync } = useDeleteGroupChat();
  const confirm = useConfirm();
  const {
    handleGroupJoin,
    isAdmin,
    isCreator,
    isJoinedGroup,
    isUser,
    isLoading,
  } = useGroupJoin(gId);

  const isAdminOrCreator = [isAdmin, isCreator].some((v) => v === true);

  const base = [
    { key: "group-report-delete", label: "Report group", icon: <GoReport /> },
  ];

  if (isAdminOrCreator) {
    base.push(
      { key: "edit-group", label: "Edit group", icon: <FiEdit /> },
      {
        key: "delete-group",
        label: "Delete group",
        icon: <FiTrash />,
      }
    );
  }

  base.push({
    key: "join-or-leave" + (isJoinedGroup ? "-delete" : ""),
    label: isJoinedGroup ? "Leave group" : "Join group",
    icon: isJoinedGroup ? <RiLogoutBoxLine /> : <MdOutlineGroup />,
  });

  const handleMenuActions = async (key: React.Key) => {
    switch (key) {
      case "group-report-delete": {
        return notifyToast("Cooming soon!");
      }
      case "join-or-leave": {
        await handleGroupJoin();
      }
      case "join-or-leave-delete": {
        await handleGroupJoin();
      }
      case "edit-group": {
        return onOpen();
      }
      case "delete-group": {
        await confirm({
          title: "Delete",
          confirmLabel: "Delete",
          confirmColor: "danger",
          body: "Are you sure delete this group?",
        });
        await deleteGroupChatAsync({ params: { groupId: gId } });
      }
    }
  };

  return (
    <MenuLayout
      isLoading={isLoading}
      onAction={handleMenuActions}
      onClose={onClose}
      isOpen={isOpen}
      items={base}
    />
  );
}
