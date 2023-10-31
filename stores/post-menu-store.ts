"use client";
import { PostExtended } from "@/types/post";
import { useCallback } from "react";
import { create } from "zustand";

type State = {
  selectedPost: PostExtended | null;
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
  setSelectedPost: (post: PostExtended | null) => void;
};

export const usePostMenuStore = create<State & Action>((set) => ({
  selectedPost: null,
  isOpen: false,
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
  setSelectedPost: (post) =>
    set((state) => ({
      ...state,
      selectedPost: post === null ? null : { ...state.selectedPost, ...post },
    })),
}));

export const useShowPostMenu = () => {
  const onOpen = usePostMenuStore((state) => state.onOpen);
  const setSelectedPost = usePostMenuStore((state) => state.setSelectedPost);

  const handleOpen = useCallback((post: PostExtended) => {
    setSelectedPost(post);
    onOpen();
  }, []);

  return handleOpen;
};

export const useHidePostMenu = () => {
  const onClose = usePostMenuStore((state) => state.onClose);
  const setSelectedPost = usePostMenuStore((state) => state.setSelectedPost);

  const handleClose = useCallback(() => {
    setSelectedPost(null);
    onClose();
  }, []);

  return handleClose;
};
export const useSetSelectedPost = () =>
  usePostMenuStore((state) => state.setSelectedPost);
export const useGetSelectedPost = () =>
  usePostMenuStore((state) => state.selectedPost);
export const usePostMenuIsOpen = () =>
  usePostMenuStore((state) => state.isOpen);
