"use client";

import { useSocketOn } from "@/hooks/use-socket-on";
import { useGetCounts } from "@/lib/api/count";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { Badge } from "@nextui-org/badge";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function MessageBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { resp } = useGetCounts(["unread_messages"]);
  const count = resp?.data?.unreadMessages ?? 0;
  const content = count > 99 ? "99+" : count;

  useSocketOn(Socket_Event.RECEIVE_MESSAGE, () => {
    queryClient.invalidateQueries({
      queryKey: keys.counts(["unread_messages"]),
    });
  });

  useSocketOn(Socket_Event.READED_MESSAGE, () => {
    queryClient.invalidateQueries({
      queryKey: keys.counts(["unread_messages"]),
    });
  });

  return (
    <Badge size="md" color="danger" content={content} isInvisible={count <= 0}>
      {children}
    </Badge>
  );
}
