"use client";
import { DisclosureMinified } from "@/types";
import { create } from "zustand";
import { IGif } from "@giphy/js-types";
import { useCallback } from "react";

type State = {
  gif: IGif | null;
};

type Action = {
  setGif: (gif: IGif | null) => void;
};

export const useGifStore = create<Action & DisclosureMinified & State>(
  (set) => {
    return {
      gif: null,
      isOpen: false,
      onClose: () => set((state) => ({ ...state, isOpen: false })),
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      setGif: (gif) => set((state) => ({ ...state, gif })),
    };
  }
);

export const useGetGif = () => useGifStore((state) => state.gif);
export const useModalGifIsOpen = () => useGifStore((state) => state.isOpen);

export const useSetGif = () => {
  const setGif = useGifStore((state) => state.setGif);

  return useCallback((gif: IGif | null) => {
    setGif(gif);
  }, []);
};
export const useHideModalGif = () => {
  const setGif = useGifStore((state) => state.setGif);
  const onClose = useGifStore((state) => state.onClose);

  return useCallback(() => {
    setGif(null);
    onClose();
  }, []);
};

export const useShowModalGif = () => {
  const setGif = useGifStore((state) => state.setGif);
  const onOpen = useGifStore((state) => state.onOpen);

  return useCallback((gif: IGif | null) => {
    setGif(gif);
    onOpen();
  }, []);
};
