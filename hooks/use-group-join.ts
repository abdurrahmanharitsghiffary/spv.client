"use client";

import { useJoinGroupChat, useLeaveGroupChat } from "@/lib/api/chats/mutation";
import {
  useGetChatRoomById,
  useGetChatRoomParticipant,
} from "@/lib/api/chats/query";
import { useGetUserById } from "@/lib/api/users/query";
import { useMembershipRequestActions } from "@/stores/membership-request-store";
import { useSession } from "@/stores/auth-store";
import { useConfirm } from "@/stores/confirm-store";

export const useGroupJoin = (groupId: number) => {
  const session = useSession();
  const { participant, isSuccess, isLoading } = useGetChatRoomParticipant(
    groupId,
    session?.id ?? -1
  );
  const { chatRoom, isLoading: isLoadCht } = useGetChatRoomById(groupId);
  const applyType = chatRoom?.data?.applyType;
  const confirm = useConfirm();
  const { joinGroupChatAsync } = useJoinGroupChat();
  const { onOpen } = useMembershipRequestActions();
  const { leaveGroupChatAsync } = useLeaveGroupChat();
  const { userData, isLoading: isLoadUserData } = useGetUserById(
    session?.id ?? -1
  );
  const isJoinedGroup = isSuccess && participant?.data !== undefined;
  const isAdmin = isSuccess && participant?.data?.role === "admin";
  const isCreator = isSuccess && participant?.data?.role === "creator";
  const isUser = isSuccess && participant?.data?.role === "user";

  const handleGroupJoin = async () => {
    if (!session) return null;
    if (isJoinedGroup) {
      await confirm({
        body: "Are you sure leave the group chat?",
        title: "Leave",
        confirmColor: "danger",
        confirmLabel: "Leave",
      });
      await leaveGroupChatAsync({
        params: { groupId: groupId },
      });
      return null;
    }
    if (userData?.data)
      if (applyType === "private") {
        return onOpen(groupId);
      }
    return await joinGroupChatAsync({
      params: {
        groupId: groupId,
      },
    });
  };

  return {
    isJoinedGroup,
    handleGroupJoin,
    isAdmin,
    isCreator,
    isUser,
    applyType,
    isLoading: isLoading || isLoadUserData || isLoadCht,
  };
};
