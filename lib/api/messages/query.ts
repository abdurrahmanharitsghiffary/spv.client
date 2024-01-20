"use client";

import { Chat } from "@/types/chat";
import { useInfinite, useQ } from "../hooks";
import { baseMessageRoutes, chatById } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { OffsetPaging } from "@/types";

export const useGetMessagesByRoomId = (
  roomId: number,
  query: OffsetPaging = { limit: 20, offset: 0 }
) => {
  const q = {
    limit: query.limit?.toString() ?? "20",
    offset: query.offset?.toString() ?? "0",
  };

  const { data: messages, ...rest } = useInfinite<Chat>({
    query: q,
    url: chatById(roomId.toString()) + "/messages",
    queryKey: [...keys.messagebyRoomId(roomId), q],
  });

  return { messages, ...rest };
};

export const useGetMessage = (messageId: number) => {
  const { data: message, ...rest } = useQ<Chat>({
    url: baseMessageRoutes + "/" + messageId,
    queryKey: keys.messageById(messageId),
    qConfig: { enabled: messageId !== -1 },
  });

  return { message, ...rest };
};
