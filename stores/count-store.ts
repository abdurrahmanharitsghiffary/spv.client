"use client";
import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { Notification } from "@/types/notification";
import { create } from "zustand";
import { useSession } from "./auth-store";

type State = {
  messageCount: number;
  notificationCount: number;
};

type Action = {
  setCountMessage: (num: number) => void;
  setCountNotification: (num: number) => void;
};

const useCountStore = create<State & { actions: Action }>((set) => ({
  messageCount: 0,
  notificationCount: 0,
  actions: {
    setCountMessage: (num) => set((state) => ({ ...state, messageCount: num })),
    setCountNotification: (num) =>
      set((state) => ({ ...state, notificationCount: num })),
  },
}));

export const useMessageCount = () => {
  const count = useCountStore((state) => state.messageCount);

  return count;
};

export const useSetCount = () => useCountStore((state) => state.actions);

export const useNotificationCount = () => {
  const count = useCountStore((state) => state.notificationCount);

  return count;
};
