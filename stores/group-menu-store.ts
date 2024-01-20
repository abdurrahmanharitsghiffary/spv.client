"use client";

import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

export const useGroupMenuStore = create<State & { actions: Action }>((set) => ({
  isOpen: false,
  actions: {
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
  },
}));

export const useGroupMenuIsOpen = () =>
  useGroupMenuStore((state) => state.isOpen);

export const useGroupMenuActions = () =>
  useGroupMenuStore((state) => state.actions);
