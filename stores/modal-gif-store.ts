"use client";
import { DisclosureMinified } from "@/types";
import { create } from "zustand";

export const useModalGifStore = create<DisclosureMinified>((set) => {
  return {
    isOpen: false,
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
  };
});
