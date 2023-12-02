"use client";

import { create } from "zustand";

type State = { isOpen: boolean };

type Actions = {
  onClose: () => void;
  onOpen: () => void;
};

const useCreateGroupStore = create<State & { actions: Actions }>((set) => ({
  isOpen: false,
  actions: {
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
  },
}));

export const useCreateGroupIsOpen = () =>
  useCreateGroupStore((state) => state.isOpen);
export const useCreateGroupActions = () =>
  useCreateGroupStore((state) => state.actions);
