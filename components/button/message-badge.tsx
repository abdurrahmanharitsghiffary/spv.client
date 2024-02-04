"use client";

import { useSocket } from "@/hooks/use-socket";
import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { useMessageCount, useSetCount } from "@/stores/count-store";
import { Badge } from "@nextui-org/badge";
import React, { useEffect } from "react";

export default function MessageBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  const count = useMessageCount();
  const socket = useSocket();
  const content = count > 99 ? "99+" : count;

  const setCount = useSetCount().setCountMessage;

  useSocketOn(Socket_Event.COUNT_MESSAGE, (c: number) => {
    setCount(c);
  });

  useSocketOn(Socket_Event.RECEIVE_MESSAGE, () => {
    setCount(count + 1);
  });

  useSocketOn(Socket_Event.READED_MESSAGE, () => {
    if (count - 1 > -1) setCount(count - 1);
  });

  useEffect(() => {
    if (!socket || !socket.connected) return;
    socket.emit(Socket_Event.GET_MESSAGE_COUNT);
  }, [socket]);

  return (
    <Badge size="md" color="danger" content={content} isInvisible={count <= 0}>
      {children}
    </Badge>
  );
}
