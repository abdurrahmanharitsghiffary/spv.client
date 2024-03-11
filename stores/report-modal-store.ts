"use client";

import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Actions = {
  onOpen: () => void;
  onClose: () => void;
};

const useReportModalStore = create<State & { actions: Actions }>((set) => ({
  actions: {
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
  },
  isOpen: false,
}));

export const useReportModalActions = () =>
  useReportModalStore((state) => state.actions);
export const useReportModalIsOpen = () =>
  useReportModalStore((state) => state.isOpen);
