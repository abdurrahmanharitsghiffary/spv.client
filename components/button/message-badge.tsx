"use client";

import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { useMessageCount, useSetCount } from "@/stores/count-store";
import { Badge } from "@nextui-org/badge";
import React from "react";

export default function MessageBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  const count = useMessageCount();

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

  return (
    <Badge size="md" color="danger" content={content} isInvisible={count <= 0}>
      {children}
    </Badge>
  );
}
