"use client";

import { base } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { SOCKETEVENT, Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketEmitterContext = createContext<
  (ev: SOCKETEVENT, data?: any) => void
>((() => {}) as any);
export const SocketContext = createContext<Socket | null>(null);
export const SocketConnectedContext = createContext<boolean>(false);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(socket?.connected ?? false);
  const queryClient = useQueryClient();

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

  const onConnected = useCallback(() => {
    console.log(socket?.connected, "On Connected");
    setConnected(socket?.connected ?? true);
  }, [socket]);

  const onDisconnect = useCallback(() => {
    console.log(socket?.connected, "On Disconnect");
    setConnected(socket?.connected ?? false);
  }, [socket]);

  useEffect(() => {
    setSocket(getSocket());
  }, [getSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnected);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, onConnected, onDisconnect]);

  useEffect(() => {
    if (!socket) return;
    socket.connect();
    socket.on(Socket_Event.ONLINE, onOnline);
    socket.on(Socket_Event.OFFLINE, onOffline);
    return () => {
      socket.disconnect();
      socket.off(Socket_Event.ONLINE, onOnline);
      socket.off(Socket_Event.OFFLINE, onOffline);
    };
  }, [socket]);

  const emitSocket = useCallback(
    (ev: SOCKETEVENT, data?: any) => {
      if (socket && connected && session !== null) {
        console.log("EMITTING");
        socket.emit(ev, data);
      }
    },
    [socket, connected, session]
  );

  return (
    <SocketEmitterContext.Provider value={emitSocket}>
      <SocketConnectedContext.Provider value={connected}>
        <SocketContext.Provider value={socket}>
          {children}
        </SocketContext.Provider>
      </SocketConnectedContext.Provider>
    </SocketEmitterContext.Provider>
  );
}
