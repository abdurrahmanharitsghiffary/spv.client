"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

export const useProfileMenuStore = create<State & Action>((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export const useShowProfileMenu = () =>
  useProfileMenuStore((state) => state.onOpen);

export const useHideProfileMenu = () =>
  useProfileMenuStore((state) => state.onClose);

export const useProfileMenuIsOpen = () =>
  useProfileMenuStore((state) => state.isOpen);
