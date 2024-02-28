"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

const useMembershipRequestStore = create<State & { actions: Action }>(
  (set) => ({
    isOpen: false,
    actions: {
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      onClose: () => set((state) => ({ ...state, isOpen: false })),
    },
  })
);

export const useMembershipRequestActions = () =>
  useMembershipRequestStore((state) => state.actions);

export const useMembershipRequestIsOpen = () =>
  useMembershipRequestStore((state) => state.isOpen);
