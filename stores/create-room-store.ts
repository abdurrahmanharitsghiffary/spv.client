"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onClose: () => void;
  onOpen: () => void;
};

const useCreateRoomStore = create<State & { actions: Action }>((set) => ({
  isOpen: false,
  actions: {
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
  },
}));

export const useCreateRoomModalIsOpen = () =>
  useCreateRoomStore((s) => s.isOpen);

export const useCreateRoomActions = () => useCreateRoomStore((s) => s.actions);
