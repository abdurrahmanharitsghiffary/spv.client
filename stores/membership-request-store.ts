"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
  groupId: number | null;
};

type Action = {
  onOpen: (id: number) => void;
  onClose: () => void;
};

const useMembershipRequestStore = create<State & { actions: Action }>(
  (set) => ({
    groupId: null,
    isOpen: false,
    actions: {
      onOpen: (id: number) =>
        set((state) => ({ ...state, isOpen: true, groupId: id })),
      onClose: () =>
        set((state) => ({ ...state, isOpen: false, groupId: null })),
    },
  })
);

export const useGetSelectedGroupId = () =>
  useMembershipRequestStore((state) => state.groupId);

export const useMembershipRequestActions = () =>
  useMembershipRequestStore((state) => state.actions);

export const useMembershipRequestIsOpen = () =>
  useMembershipRequestStore((state) => state.isOpen);
