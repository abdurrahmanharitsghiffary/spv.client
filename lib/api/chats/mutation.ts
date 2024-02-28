"use client";
import { baseChatRoutes, baseGroupRoutes } from "@/lib/endpoints";
import { useMutate } from "../hooks";
import { keys } from "@/lib/queryKey";
import { ParticipantsField } from "@/types";
import { GroupApplyType, GroupVisibility } from "@/types/chat";

type GroupOptions = {
  title?: string;
  description?: string;
  applyType?: GroupApplyType;
  groupVisibility?: GroupVisibility;
  image?: File;
};

export const useCreateChatRoom = () => {
  const {
    mutate: createChatRoom,
    mutateAsync: createChatRoomAsync,
    ...rest
  } = useMutate<{ participantId: number }>({
    baseUrl: baseChatRoutes,
    method: "post",
  });

  return { createChatRoom, createChatRoomAsync, ...rest };
};

export const useCreateGroupChat = () => {
  const {
    mutate: createGroupChat,
    mutateAsync: createGroupChatAsync,
    ...rest
  } = useMutate<
    GroupOptions & {
      participants: ParticipantsField[];
    }
  >({
    baseUrl: baseGroupRoutes,
    method: "post",
  });

  return { createGroupChat, createGroupChatAsync, ...rest };
};

type GroupParams = { groupId: number };
export const useUpdateGroupChat = () => {
  const {
    mutate: updateGroupChat,
    mutateAsync: updateGroupChatAsync,
    ...rest
  } = useMutate<GroupOptions, GroupParams>({
    baseUrl: baseGroupRoutes + "/:groupId",
    method: "patch",
  });
  return { updateGroupChat, updateGroupChatAsync, ...rest };
};

export const useDeleteGroupChat = () => {
  const {
    mutate: deleteGroupChat,
    mutateAsync: deleteGroupChatAsync,
    ...rest
  } = useMutate<undefined, GroupParams>({
    baseUrl: baseGroupRoutes + "/:groupId",
    method: "delete",
  });
  return { deleteGroupChat, deleteGroupChatAsync, ...rest };
};

export const useJoinGroupChat = () => {
  const {
    mutate: joinGroupChat,
    mutateAsync: joinGroupChatAsync,
    ...rest
  } = useMutate<undefined, GroupParams>({
    baseUrl: baseGroupRoutes + "/:groupId/join",
    method: "post",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.groupId)),
      keys.chatByRoomId(Number(v.params?.groupId)),
    ],
  });

  return { joinGroupChat, joinGroupChatAsync, ...rest };
};

export const useLeaveGroupChat = () => {
  const {
    mutate: leaveGroupChat,
    mutateAsync: leaveGroupChatAsync,
    ...rest
  } = useMutate<undefined, GroupParams>({
    baseUrl: baseGroupRoutes + "/:groupId/leave",
    method: "delete",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.groupId)),
      keys.chatByRoomId(Number(v.params?.groupId)),
    ],
  });

  return { leaveGroupChat, leaveGroupChatAsync, ...rest };
};

type AddParticipantsOptions = { ids: number[] };
type AddParticipantsParams = { groupId: number };

export const useAddGroupParticipants = () => {
  const {
    mutate: addParticipants,
    mutateAsync: addParticipantsAsync,
    ...rest
  } = useMutate<AddParticipantsOptions, AddParticipantsParams>({
    baseUrl: baseGroupRoutes + "/:groupId/participants",
    method: "post",
  });

  return { addParticipants, addParticipantsAsync, ...rest };
};

export const useUpdateParticipants = () => {
  const {
    mutate: updateParticipants,
    mutateAsync: updateParticipantsAsync,
    ...rest
  } = useMutate<{ participants: ParticipantsField[] }, AddParticipantsParams>({
    baseUrl: baseGroupRoutes + "/:groupId/participants",
    method: "patch",
  });

  return { updateParticipants, updateParticipantsAsync, ...rest };
};

export const useRemoveParticipants = () => {
  const {
    mutate: removeParticipants,
    mutateAsync: removeParticipantsAsync,
    ...rest
  } = useMutate<{ ids: number[] }, AddParticipantsParams>({
    baseUrl: baseGroupRoutes + "/:groupId/participants",
    method: "delete",
  });

  return { removeParticipants, removeParticipantsAsync, ...rest };
};
