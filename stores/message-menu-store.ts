"use client";

import { create } from "zustand";

type State = {
  isOpen: boolean;
  id: number;
};

type Action = {
  onOpen: (messageId: number) => void;
  onClose: () => void;
  reset: () => void;
};

const useMessageMenuStore = create<State & { actions: Action }>((set) => ({
  id: -1,
  isOpen: false,
  actions: {
    onOpen: (messageId) =>
      set((state) => ({ ...state, isOpen: true, id: messageId })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    reset: () => set((state) => ({ ...state, id: -1 })),
  },
}));

export const useMessageMenuId = () => useMessageMenuStore((state) => state.id);

export const useMessageMenuActions = () =>
  useMessageMenuStore((state) => state.actions);

export const useMessageMenuIsOpen = () =>
  useMessageMenuStore((state) => state.isOpen);
