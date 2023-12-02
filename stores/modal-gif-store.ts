"use client";
import { DisclosureStoreMinified } from "@/types";
import { create } from "zustand";
import { IGif } from "@giphy/js-types";
import { useCallback } from "react";

type State = {
  gif: IGif | null;
  isOpen: boolean;
};

type Action = {
  setGif: (gif: IGif | null) => void;
} & DisclosureStoreMinified["actions"];

export const useGifStore = create<{ actions: Action } & State>((set) => {
  return {
    gif: null,
    isOpen: false,
    actions: {
      onClose: () => set((state) => ({ ...state, isOpen: false })),
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      setGif: (gif) => set((state) => ({ ...state, gif })),
    },
  };
});

export const useGetGif = () => useGifStore((state) => state.gif);
export const useModalGifIsOpen = () => useGifStore((state) => state.isOpen);
export const useGifModalActions = () => useGifStore((state) => state.actions);
export const useSetGif = () => {
  const { setGif } = useGifModalActions();

  return useCallback((gif: IGif | null) => {
    setGif(gif);
  }, []);
};
export const useHideModalGif = () => {
  const { setGif, onClose } = useGifModalActions();

  return useCallback(() => {
    setGif(null);
    onClose();
  }, []);
};

export const useShowModalGif = () => {
  const { setGif, onOpen } = useGifModalActions();

  return useCallback((gif: IGif | null) => {
    setGif(gif);
    onOpen();
  }, []);
};
