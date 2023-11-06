"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

const useChatMenuStore = create<State & Action>((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export const useShowChatMenu = () => useChatMenuStore((state) => state.onOpen);

export const useHideChatMenu = () => useChatMenuStore((state) => state.onClose);

export const useChatMenuIsOpen = () =>
  useChatMenuStore((state) => state.isOpen);
