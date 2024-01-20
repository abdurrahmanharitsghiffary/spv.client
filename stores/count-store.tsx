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

const useCountStore = create<State & Action>((set) => ({
  messageCount: 0,
  notificationCount: 0,
  setCountMessage: (num) => set((state) => ({ ...state, messageCount: num })),
  setCountNotification: (num) =>
    set((state) => ({ ...state, notificationCount: num })),
}));

export const useMessageCount = () => {
  const count = useCountStore((state) => state.messageCount);

  const setCount = useCountStore((state) => state.setCountMessage);
  useSocketOn(Socket_Event.COUNT_MESSAGE, (c: number) => {
    setCount(c);
  });

  useSocketOn(Socket_Event.RECEIVE_MESSAGE, () => {
    setCount(count + 1);
  });

  useSocketOn(Socket_Event.READED_MESSAGE, () => {
    if (count - 1 > -1) setCount(count - 1);
  });

  return count;
};

export const useNotificationCount = () => {
  const count = useCountStore((state) => state.notificationCount);

  const setCount = useCountStore((state) => state.setCountNotification);
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

  return count;
};
