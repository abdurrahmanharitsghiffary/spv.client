"use client";

import { keys } from "@/lib/queryKey";
import { useInfinite, useQ } from "../hooks";
import { baseChatRoutes, chatById } from "@/lib/endpoints";
import { ChatRoom, ChatRoomParticipant } from "@/types/chat";
import { OffsetPaging } from "@/types";

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
  query: OffsetPaging = { limit: 5, offset: 0 }
) => {
  const q = {
    limit: query.limit?.toString() ?? "5",
    offset: query.offset?.toString() ?? "0",
  };

  const { data: participants, ...rest } = useInfinite<ChatRoomParticipant>({
    query,
    url: chatById(roomId.toString()) + "/participants",
    queryKey: [...keys.participantByRoomId(roomId), q],
  });

  return { participants, ...rest };
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
