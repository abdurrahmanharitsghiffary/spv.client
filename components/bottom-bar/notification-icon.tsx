"use client";

import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import { useNotificationCount, useSetCount } from "@/stores/count-store";
import { Notification } from "@/types/notification";
import { Badge } from "@nextui-org/badge";
import React from "react";
import { FiBell } from "react-icons/fi";

export default function NotificationIcon({ isActive }: { isActive?: boolean }) {
  const count = useNotificationCount();

  const setCount = useSetCount().setCountNotification;
  const session = useSession();
  useSocketOn<number>(Socket_Event.COUNT_NOTIFICATION, (c) => {
    setCount(c);
  });

  useSocketOn<Notification>(Socket_Event.NOTIFY, (c) => {
    if (c.receiverId !== session?.id) return null;
    setCount(count + 1);
  });

  useSocketOn(Socket_Event.READED_NOTIFICATION, () => {
    if (count - 1 > -1) setCount(count - 1);
  });

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
