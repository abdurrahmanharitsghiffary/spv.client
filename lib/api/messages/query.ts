"use client";

import { Chat } from "@/types/chat";
import { useInfinite } from "../hooks";
import { chatById } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";

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
