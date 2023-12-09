"use client";

import { create } from "zustand";

type State = { isOpen: boolean };

type Actions = {
  onClose: () => void;
  onOpen: () => void;
};

const useEditGroupStore = create<State & { actions: Actions }>((set) => ({
  isOpen: false,
  actions: {
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
  },
}));

export const useEditGroupIsOpen = () =>
  useEditGroupStore((state) => state.isOpen);
export const useEditGroupActions = () =>
  useEditGroupStore((state) => state.actions);
