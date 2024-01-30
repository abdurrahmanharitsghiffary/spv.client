"use client";

import { useSocket } from "@/hooks/use-socket";
import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import { useNotificationCount, useSetCount } from "@/stores/count-store";
import { Notification } from "@/types/notification";
import { Badge } from "@nextui-org/badge";
import React, { useEffect } from "react";
import { FiBell } from "react-icons/fi";

export default function NotificationIcon({ isActive }: { isActive?: boolean }) {
  const count = useNotificationCount();
  const socket = useSocket();
  const setCount = useSetCount().setCountNotification;
  const session = useSession();

  const onNotify = (c: Notification) => {
    if (c.receiverId !== session?.id) return null;
    setCount(count + 1);
  };

  const onReceiveNotiCount = (c: number) => {
    setCount(c);
  };

  const onReadNotification = (c: Notification) => {
    console.log(c, "readed notification");
    if (count - 1 > -1) setCount(count - 1);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(Socket_Event.NOTIFY, onNotify);
    socket.on(Socket_Event.COUNT_NOTIFICATION, onReceiveNotiCount);
    socket.on(Socket_Event.READED_NOTIFICATION, onReadNotification);
    return () => {
      socket.off(Socket_Event.NOTIFY, onNotify);
      socket.off(Socket_Event.COUNT_NOTIFICATION, onReceiveNotiCount);
      socket.off(Socket_Event.READED_NOTIFICATION, onReadNotification);
    };
  }, [socket]);

  return (
    <Badge
      content={count.toString()}
      classNames={{ base: "!block" }}
      color="danger"
      isInvisible={count === 0}
    >
      {isActive ? <FiBell stroke="#0070F0" size={20} /> : <FiBell size={20} />}
    </Badge>
  );
}
