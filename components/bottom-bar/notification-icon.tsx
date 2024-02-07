"use client";

import { useSocket } from "@/hooks/use-socket";
import { useGetCounts } from "@/lib/api/count";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import { Notification } from "@/types/notification";
import { Badge } from "@nextui-org/badge";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { FiBell } from "react-icons/fi";

export default function NotificationIcon({ isActive }: { isActive?: boolean }) {
  const { resp } = useGetCounts(["unread_notifications"]);
  const queryClient = useQueryClient();
  const count = resp?.data?.unreadNotifications ?? 0;
  const socket = useSocket();
  const session = useSession();

  const onNotify = useCallback(
    (c: Notification) => {
      if (c.receiverId !== session?.id) return null;
      queryClient.invalidateQueries({
        queryKey: keys.counts(["unread_notifications"]),
      });
    },
    [session, queryClient]
  );

  const onReadNotification = useCallback(
    (c: Notification) => {
      queryClient.invalidateQueries({
        queryKey: keys.counts(["unread_notifications"]),
      });
    },
    [queryClient]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on(Socket_Event.NOTIFY, onNotify);
    socket.on(Socket_Event.READED_NOTIFICATION, onReadNotification);
    return () => {
      socket.off(Socket_Event.NOTIFY, onNotify);
      socket.off(Socket_Event.READED_NOTIFICATION, onReadNotification);
    };
  }, [socket, onNotify, onReadNotification]);

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
