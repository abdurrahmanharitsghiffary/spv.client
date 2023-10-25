"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

export const useUserMenuStore = create<State & Action>((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export const useShowUserMenu = () => useUserMenuStore((state) => state.onOpen);

export const useHideUserMenu = () => useUserMenuStore((state) => state.onClose);

export const useUserMenuIsOpen = () =>
  useUserMenuStore((state) => state.isOpen);
