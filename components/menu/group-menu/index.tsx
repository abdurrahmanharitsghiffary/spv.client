"use client";

import React from "react";
import MenuLayout from "../layout";
import { useParams } from "next/navigation";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineGroup } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
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
import { BiTrash } from "react-icons/bi";
import { AiOutlineShareAlt } from "react-icons/ai";
import copyToClipboard from "@/lib/copy-to-clipboard";
import { url } from "@/lib/consts";
import { sortMenuItems } from "@/lib/sort-menu";
import { useReportModalActions } from "@/stores/report-modal-store";

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
  const { onOpen: openReportModal } = useReportModalActions();

  const isAdminOrCreator = [isAdmin, isCreator].some((v) => v === true);

  const base = [
    {
      key: "join-or-leave" + (isJoinedGroup ? "-delete" : ""),
      label: isJoinedGroup ? "Leave group" : "Join group",
      icon: isJoinedGroup ? <RiLogoutBoxLine /> : <MdOutlineGroup />,
    },
    {
      key: "share-link",
      label: "Share group link",
      icon: <AiOutlineShareAlt />,
    },
    { key: "group-report-delete", label: "Report group", icon: <GoReport /> },
  ];

  if (isAdminOrCreator) {
    base.push({ key: "edit-group", label: "Edit group", icon: <FiEdit /> });
  }

  if (isCreator) {
    base.push({
      key: "delete-group",
      label: "Delete group",
      icon: <BiTrash />,
    });
  }

  sortMenuItems(base);

  const handleMenuActions = async (key: React.Key) => {
    switch (key) {
      case "group-report-delete": {
        openReportModal("group", gId);
        return;
      }
      case "share-link": {
        await copyToClipboard(url(`/groups/${gId}`));
        return;
      }
      case "join-or-leave": {
        await handleGroupJoin();
        return;
      }
      case "join-or-leave-delete": {
        await handleGroupJoin();
        return;
      }
      case "edit-group": {
        onOpen();
        return;
      }
      case "delete-group": {
        await confirm({
          title: "Delete",
          confirmLabel: "Delete",
          confirmColor: "danger",
          body: "Are you sure delete this group?",
        });
        await deleteGroupChatAsync({ params: { groupId: gId } });
        return;
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
