"use client";

import { keys } from "@/lib/queryKey";
import { useInfinite, useQ } from "../hooks";
import { baseChatRoutes, chatById } from "@/lib/endpoints";
import { Chat, ChatRoom, ChatRoomParticipant } from "@/types/chat";

export const useGetChatRoomById = (roomId: number, enabled: boolean = true) => {
  const { data: chatRoom, ...rest } = useQ<ChatRoom>({
    url: chatById(roomId.toString()),
    queryKey: keys.chatByRoomId(roomId),
    qConfig: { enabled: roomId > -1 && !isNaN(roomId) && enabled },
  });

  return { chatRoom, ...rest };
};

export const useGetParticipantsByRoomId = (
  roomId: number,
  query: { limit?: string; offset?: string } = { limit: "5", offset: "0" }
) => {
  const { data: participants, ...rest } = useInfinite<ChatRoomParticipant>({
    query,
    url: chatById(roomId.toString()) + "/participants",
    queryKey: [...keys.participantByRoomId(roomId), query],
  });

  return { participants, ...rest };
};

export const useGetMessagesByRoomId = (
  roomId: number,
  query: { limit?: string; offset?: string } = { limit: "20", offset: "0" }
) => {
  const { data: messages, ...rest } = useInfinite<Chat>({
    query,
    url: chatById(roomId.toString()) + "/messages",
    queryKey: [...keys.messagebyRoomId(roomId), query],
  });

  return { messages, ...rest };
};

export const useGetChatRoomParticipant = (
  roomId: number,
  participantId: number
) => {
  const { data: participant, ...rest } = useQ<ChatRoomParticipant>({
    url: baseChatRoutes + `/${roomId}/participants/${participantId}`,
    queryKey: keys.participantByRoomAndParticipantId(roomId, participantId),
    qConfig: {
      enabled: participantId !== -1 && roomId !== -1,
    },
  });
  return { participant, ...rest };
};
