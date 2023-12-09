"use client";

import { baseChatRoutes, baseMessageRoutes } from "@/lib/endpoints";
import { useMutate } from "../hooks";
import { keys } from "@/lib/queryKey";
import { CreateMessageData, ParticipantsField } from "@/types";

export const useCreateMessage = () => {
  const {
    mutate: createMessage,
    mutateAsync: createMessageAsync,
    ...rest
  } = useMutate<CreateMessageData>({
    baseUrl: baseMessageRoutes,
    method: "post",
    invalidateTags: (v) => [
      keys.chatByRoomId(v.body?.chatRoomId ?? -1),
      keys.meChats(),
    ],
  });

  return { createMessage, createMessageAsync, ...rest };
};

export const useCreateChatRoom = () => {
  const {
    mutate: createChatRoom,
    mutateAsync: createChatRoomAsync,
    ...rest
  } = useMutate<{ participantId: number }>({
    baseUrl: baseChatRoutes,
    method: "post",
    invalidateTags: (v) => [keys.meChats()],
  });

  return { createChatRoom, createChatRoomAsync, ...rest };
};

export const useCreateGroupChat = () => {
  const {
    mutate: createGroupChat,
    mutateAsync: createGroupChatAsync,
    ...rest
  } = useMutate<{
    participants: ParticipantsField[];
    title?: string;
    description?: string;
    image: File;
  }>({
    baseUrl: baseChatRoutes + "/group",
    method: "post",
    invalidateTags: (v) => [keys.meChats()],
  });

  return { createGroupChat, createGroupChatAsync, ...rest };
};

export const useUpdateGroupChat = () => {
  const {
    mutate: updateGroupChat,
    mutateAsync: updateGroupChatAsync,
    ...rest
  } = useMutate<
    {
      participants?: ParticipantsField[];
      title?: string;
      description?: string;
      image?: File;
    },
    { groupId: number }
  >({
    baseUrl: baseChatRoutes + "/group/:groupId",
    method: "patch",
    invalidateTags: (v) => [keys.meChats()],
  });
  return { updateGroupChat, updateGroupChatAsync, ...rest };
};

export const useDeleteGroupChat = () => {
  const {
    mutate: deleteGroupChat,
    mutateAsync: deleteGroupChatAsync,
    ...rest
  } = useMutate<undefined, { groupId: number }>({
    baseUrl: baseChatRoutes + "/group/:groupId",
    method: "delete",
    invalidateTags: (v) => [keys.meChats()],
  });
  return { deleteGroupChat, deleteGroupChatAsync, ...rest };
};

export const useJoinGroupChat = () => {
  const {
    mutate: joinGroupChat,
    mutateAsync: joinGroupChatAsync,
    ...rest
  } = useMutate<undefined, { groupId: number }>({
    baseUrl: baseChatRoutes + "/group/:groupId/join",
    method: "post",
    invalidateTags: (v) => [keys.meChats()],
  });

  return { joinGroupChat, joinGroupChatAsync, ...rest };
};

export const useLeaveGroupChat = () => {
  const {
    mutate: leaveGroupChat,
    mutateAsync: leaveGroupChatAsync,
    ...rest
  } = useMutate<undefined, { groupId: number }>({
    baseUrl: baseChatRoutes + "/group/:groupId/leave",
    method: "delete",
    invalidateTags: (v) => [keys.meChats()],
  });

  return { leaveGroupChat, leaveGroupChatAsync, ...rest };
};

export const useAddGroupParticipants = () => {
  const {
    mutate: addParticipants,
    mutateAsync: addParticipantsAsync,
    ...rest
  } = useMutate<{ participants: ParticipantsField[] }, { roomId: number }>({
    baseUrl: baseChatRoutes + "/:roomId/partcipants",
    method: "patch",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.roomId)),
      keys.chatByRoomId(Number(v.params?.roomId)),
    ],
  });

  return { addParticipants, addParticipantsAsync, ...rest };
};

export const useRemoveParticipants = () => {
  const {
    mutate: removeParticipants,
    mutateAsync: removeParticipantsAsync,
    ...rest
  } = useMutate<{ ids: number[] }, { roomId: number }>({
    baseUrl: baseChatRoutes + "/:roomId/partcipants",
    method: "delete",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.roomId)),
      keys.chatByRoomId(Number(v.params?.roomId)),
    ],
  });

  return { removeParticipants, removeParticipantsAsync, ...rest };
};
