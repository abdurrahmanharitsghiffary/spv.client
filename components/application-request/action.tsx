"use client";

import {
  useApproveGroupMembershipRequest,
  useDeleteGroupMembershipRequest,
  useRejectGroupMembershipRequest,
} from "@/lib/api/application-request/mutation";
import { useGetChatRoomParticipant } from "@/lib/api/chats/query";
import { useSession } from "@/stores/auth-store";
import { useConfirm } from "@/stores/confirm-store";
import { AppRequest } from "@/types/app-request";
import { Button } from "@nextui-org/button";
import React from "react";
import { toast } from "react-toastify";
import IconButton from "../button/icon-button";
import { BiTrash } from "react-icons/bi";

export default function AppRequestAction({
  appRequest,
  groupId,
}: {
  appRequest: AppRequest | undefined;
  groupId: number;
}) {
  const confirm = useConfirm();
  const { approveGMRAsync, isLoading: isAprLoading } =
    useApproveGroupMembershipRequest();
  const { rejectGMRAsync, isLoading: isRejLoading } =
    useRejectGroupMembershipRequest();
  const session = useSession();
  const { participant } = useGetChatRoomParticipant(groupId, session?.id ?? -1);
  const isAuthored = session?.id === appRequest?.sender.id;
  const role = participant?.data.role;
  const isAdminOrCreator = ["admin", "creator"].includes(role ?? "");
  console.log(appRequest, "App Rqeuest");
  console.log(appRequest?.status);
  const handleReject = async () => {
    try {
      await confirm({
        title: "Reject",
        body: "Reject this membership request?",
        confirmColor: "danger",
        confirmLabel: "Reject",
      });
      await rejectGMRAsync({
        params: { groupId, requestId: appRequest?.id ?? -1 },
      });
    } catch (err: any) {
      if (err?.message) toast.error(err.message);
    }
  };

  const handleAccept = async () => {
    try {
      await confirm({
        title: "Approve",
        body: "Approve this membership request?",
        confirmLabel: "Approve",
      });
      await approveGMRAsync({
        params: { groupId, requestId: appRequest?.id ?? -1 },
      });
    } catch (err: any) {
      if (err?.message) toast.error(err.message);
    }
  };

  return (
    <div className="flex gap-2 self-end">
      {appRequest?.status === "PENDING" && isAdminOrCreator && (
        <>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            className="font-semibold"
            onClick={handleReject}
            isLoading={isRejLoading}
          >
            Reject
          </Button>
          <Button
            size="sm"
            color="primary"
            className="font-semibold"
            onClick={handleAccept}
            isLoading={isAprLoading}
          >
            Approve
          </Button>
        </>
      )}
      {isAuthored && <DeleteButton requestId={appRequest?.id ?? -1} />}
    </div>
  );
}

function DeleteButton({ requestId }: { requestId: number }) {
  const { deleteGMRAsync } = useDeleteGroupMembershipRequest();
  const confirm = useConfirm();

  const handleDelete = async () => {
    await confirm({
      body: "Delete this request?",
      title: "Delete",
      confirmColor: "danger",
      confirmLabel: "Delete",
    });
    await deleteGMRAsync({ params: { requestId } });
  };

  return (
    <IconButton
      size="sm"
      variant="flat"
      radius="md"
      color="danger"
      onClick={handleDelete}
    >
      <BiTrash />
    </IconButton>
  );
}
