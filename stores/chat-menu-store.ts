"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

const useChatMenuStore = create<State & { actions: Action }>((set) => ({
  isOpen: false,
  actions: {
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
  },
}));

export const useChatMenuActions = () =>
  useChatMenuStore((state) => state.actions);

export const useChatMenuIsOpen = () =>
  useChatMenuStore((state) => state.isOpen);
