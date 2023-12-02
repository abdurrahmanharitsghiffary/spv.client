"use client";

import { base } from "@/lib/endpoints";
import { useSession } from "@/stores/auth-store";
import { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const session = useSession();
  console.log(session, " session");
  const getSocket = useCallback(() => {
    const socket = io(base, {
      auth: {
        token: session?.accessToken,
      },
    });
    return socket;
  }, [session?.accessToken]);

  useEffect(() => {
    setSocket(getSocket());
    // Handle token expired
  }, [getSocket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
