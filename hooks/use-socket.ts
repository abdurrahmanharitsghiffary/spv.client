"use client";

import {
  SocketConnectedContext,
  SocketContext,
  SocketEmitterContext,
} from "@/context/socket-context";
import { useContext } from "react";

export const useSocket = () => useContext(SocketContext);

export const useSocketConnected = () => useContext(SocketConnectedContext);

export const useEmitSocket = () => useContext(SocketEmitterContext);
