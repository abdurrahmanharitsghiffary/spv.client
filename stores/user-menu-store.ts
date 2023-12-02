"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

export const useUserMenuStore = create<State & { actions: Action }>((set) => ({
  isOpen: false,
  actions: {
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
  },
}));

export const useUserMenuActions = () =>
  useUserMenuStore((state) => state.actions);

export const useUserMenuIsOpen = () =>
  useUserMenuStore((state) => state.isOpen);
