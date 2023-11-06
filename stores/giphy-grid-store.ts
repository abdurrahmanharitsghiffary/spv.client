"use client";
import { DisclosureMinified } from "@/types";
import { create } from "zustand";

export const useGiphyGridStore = create<DisclosureMinified>((set) => ({
  isOpen: false,
  onClose: () => set((state) => ({ ...state, isOpen: false })),
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
}));

export const useGiphyGridIsOpen = () =>
  useGiphyGridStore((state) => state.isOpen);
export const useHideGiphyGrid = () =>
  useGiphyGridStore((state) => state.onClose);
export const useShowGiphyGrid = () =>
  useGiphyGridStore((state) => state.onOpen);
