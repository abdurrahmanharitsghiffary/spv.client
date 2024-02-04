"use client";

import { useEffect } from "react";
import { useSocket } from "./use-socket";
import { SOCKETEVENT } from "@/lib/socket-event";

export const useSocketOn = <T>(event: SOCKETEVENT, cb: (data: T) => void) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on(event, cb);

    return () => {
      socket.off(event, cb);
    };
  }, [socket, cb, event]);
};
