"use client";
import { PostId } from "@/types/post";
import { useCallback } from "react";
import { create } from "zustand";

type State = {
  selectedPost: PostId | null;
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
  setSelectedPost: (post: PostId | null) => void;
};

export const usePostMenuStore = create<State & { actions: Action }>((set) => ({
  selectedPost: null,
  isOpen: false,
  actions: {
    onOpen: () => set((state) => ({ ...state, isOpen: true })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
    setSelectedPost: (post) =>
      set((state) => ({
        ...state,
        selectedPost: post === null ? null : { ...state.selectedPost, ...post },
      })),
  },
}));

export const usePostMenuActions = () =>
  usePostMenuStore((state) => state.actions);

export const useShowPostMenu = () => {
  const { onOpen, setSelectedPost } = usePostMenuActions();

  const handleOpen = useCallback((post: PostId) => {
    setSelectedPost(post);
    onOpen();
  }, []);

  return handleOpen;
};

export const useHidePostMenu = () => {
  const { onClose, setSelectedPost } = usePostMenuActions();

  const handleClose = useCallback(() => {
    setSelectedPost(null);
    onClose();
  }, []);

  return handleClose;
};

export const useGetSelectedPost = () =>
  usePostMenuStore((state) => state.selectedPost);
export const usePostMenuIsOpen = () =>
  usePostMenuStore((state) => state.isOpen);
