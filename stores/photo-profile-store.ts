"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

const usePhotoProfile = create<State & { actions: Action }>((set) => ({
  isOpen: false,
  actions: {
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
  },
}));

export const usePhotoProfileActions = () =>
  usePhotoProfile((state) => state.actions);

export const usePhotoProfileMenuIsOpen = () =>
  usePhotoProfile((state) => state.isOpen);
