"use client";

import { base } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();
  const session = useSession();
  const getSocket = useCallback(() => {
    const socket = io(base, {
      auth: {
        token: session?.accessToken,
      },
    });
    return socket;
  }, [session]);

  const onOnline = async (userId: string) => {
    queryClient.invalidateQueries({ queryKey: keys.user });
    queryClient.invalidateQueries({ queryKey: keys.userById(Number(userId)) });
    queryClient.invalidateQueries({ queryKey: keys.meChats() });
    queryClient.invalidateQueries({ queryKey: ["chat"] });
  };

  const onOffline = async (userId: string) => {
    queryClient.invalidateQueries({ queryKey: keys.user });
    queryClient.invalidateQueries({ queryKey: keys.userById(Number(userId)) });
    queryClient.invalidateQueries({ queryKey: keys.meChats() });
    queryClient.invalidateQueries({ queryKey: ["chat"] });
  };

  useEffect(() => {
    setSocket(getSocket());
    // Handle token expired
  }, [getSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.ONLINE, onOnline);
    socket.on(Socket_Event.OFFLINE, onOffline);
    return () => {
      socket.off(Socket_Event.ONLINE, onOnline);
      socket.off(Socket_Event.OFFLINE, onOffline);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
