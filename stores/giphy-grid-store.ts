"use client";
import { DisclosureStoreMinified } from "@/types";
import { create } from "zustand";

export const useGiphyGridStore = create<DisclosureStoreMinified>((set) => ({
  isOpen: false,
  actions: {
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
  },
}));

export const useGiphyGridIsOpen = () =>
  useGiphyGridStore((state) => state.isOpen);
export const useGiphyGridActions = () =>
  useGiphyGridStore((state) => state.actions);
