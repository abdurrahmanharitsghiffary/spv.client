"use client";

import {
  useJoinGroupChatOptimistic,
  useLeaveGroupChatOptimistic,
} from "@/lib/api/chats/mutation";
import { useGetChatRoomParticipant } from "@/lib/api/chats/query";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useGetUserById } from "@/lib/api/users/query";
import { getUserSimplified } from "@/lib/getUserSimplified";
import { useSession } from "@/stores/auth-store";
import { useConfirm } from "@/stores/confirm-store";
import { Button, ButtonProps } from "@nextui-org/button";
import { useParams } from "next/navigation";
import React from "react";

export default function JoinButton(props: ButtonProps) {
  const { onClick, isIconOnly, color, ...rest } = props;
  const session = useSession();
  const { groupId } = useParams();
  const gId = Number(groupId);
  const { participant, isSuccess } = useGetChatRoomParticipant(
    gId,
    session?.id ?? -1
  );
  const confirm = useConfirm();
  const { joinGroupAsync } = useJoinGroupChatOptimistic();
  const { leaveGroupAsync } = useLeaveGroupChatOptimistic();
  const { userData } = useGetUserById(session?.id ?? -1);
  const isJoinedInGroup = isSuccess && participant?.data !== undefined;

  const handleGroup = async () => {
    if (!session) return null;
    if (isJoinedInGroup) {
      await confirm({
        body: "Are you sure leave the group chat?",
        title: "Leave",
        confirmColor: "danger",
        confirmLabel: "Leave",
      });
      await leaveGroupAsync({
        body: { userId: session?.id },
        params: { groupId: gId },
      });
      return null;
    }
    if (userData?.data)
      return await joinGroupAsync({
        body: {
          user: {
            ...getUserSimplified(userData?.data),
            role: "user",
            joinedAt: new Date(Date.now()),
            roomId: gId,
          },
        },
        params: {
          groupId: gId,
        },
      });
  };

  return (
    <Button
      onClick={handleGroup}
      isIconOnly={isJoinedInGroup}
      color={isJoinedInGroup ? "danger" : "default"}
      {...rest}
    >
      {isJoinedInGroup ? <RiLogoutBoxLine size={20} /> : "Join"}
    </Button>
  );
}
