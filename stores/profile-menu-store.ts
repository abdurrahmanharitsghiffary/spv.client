"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

export const useProfileMenuStore = create<State & { actions: Action }>(
  (set) => ({
    isOpen: false,
    actions: {
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      onClose: () => set((state) => ({ ...state, isOpen: false })),
    },
  })
);

export const useProfileMenuActions = () =>
  useProfileMenuStore((state) => state.actions);

export const useProfileMenuIsOpen = () =>
  useProfileMenuStore((state) => state.isOpen);
