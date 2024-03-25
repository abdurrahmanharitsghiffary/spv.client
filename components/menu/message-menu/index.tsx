"use client";

import { AiFillInfoCircle, AiOutlineCopy, AiOutlineEdit } from "react-icons/ai";
import MenuLayout, { MenuItems } from "../layout";
import { BiTrash } from "react-icons/bi";
import {
  useMessageMenuActions,
  useMessageMenuId,
  useMessageMenuIsOpen,
} from "@/stores/message-menu-store";
import React from "react";
import copyToClipboard from "@/lib/copy-to-clipboard";
import { useGetMessage } from "@/lib/api/messages/query";
import { useDeleteMessage } from "@/lib/api/messages/mutation";
import { useConfirm } from "@/stores/confirm-store";
import { useMessageEditDisclosure } from "@/context/message-edit-form-context";
import { useSession } from "@/stores/auth-store";
import { useMessageInfoDisclosure } from "@/context/message-info-context";
import { notifyToast } from "@/lib/toast";
import { GoReport } from "react-icons/go";
import { useReportModalActions } from "@/stores/report-modal-store";

export default function MessageMenu() {
  const isOpen = useMessageMenuIsOpen();
  const { onClose } = useMessageMenuActions();
  const messageId = useMessageMenuId();
  const { deleteMessageAsync } = useDeleteMessage();
  const { message, isLoading, isSuccess } = useGetMessage(messageId);
  const authorId = message?.data?.author?.id;
  const confirm = useConfirm();
  const { onOpen } = useMessageEditDisclosure();
  const { onOpen: onDetailClick } = useMessageInfoDisclosure();
  const { onOpen: openReportModal } = useReportModalActions();
  const session = useSession();

  const baseItems: MenuItems[] = [
    { key: "info", label: "Message details", icon: <AiFillInfoCircle /> },
    { key: "copy", label: "Copy message", icon: <AiOutlineCopy /> },
  ];

  if (session?.id === authorId) {
    baseItems.push(
      { key: "edit", label: "Edit message", icon: <AiOutlineEdit /> },
      { key: "delete", label: "Delete message", icon: <BiTrash /> }
    );
  } else if (session?.id !== authorId) {
    baseItems.push({
      key: "report-delete",
      label: "Report message",
      icon: <GoReport />,
    });
  }

  const handleMenuActions = async (key: React.Key) => {
    switch (key) {
      case "copy": {
        return await copyToClipboard(message?.data?.message ?? "");
      }
      case "report-delete": {
        openReportModal("message", messageId);
        return;
      }
      case "delete": {
        await confirm({
          title: "Delete",
          confirmLabel: "Delete",
          confirmColor: "danger",
          body: "Are you sure to delete this message?",
        });
        await deleteMessageAsync({ params: { messageId } });
        return;
      }
      case "edit": {
        onOpen();
        return;
      }
      case "info": {
        return onDetailClick();
      }
      default: {
        return notifyToast("Cooming soon!");
      }
    }
  };

  return (
    <MenuLayout
      shouldToastWhenActionError
      isLoading={isLoading}
      isOpen={isOpen}
      onAction={handleMenuActions}
      onClose={onClose}
      items={baseItems}
    />
  );
}
