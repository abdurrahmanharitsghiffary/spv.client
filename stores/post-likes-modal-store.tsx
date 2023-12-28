"use client";

import { create } from "zustand";

type State = {
  isOpen: boolean;
  postId: number;
};

type Action = {
  onOpen: (postId: number) => void;
  onClose: () => void;
};

const usePostLikeModalStore = create<State & { actions: Action }>((set) => ({
  postId: -1,
  isOpen: false,
  actions: {
    onOpen: (postId: number) =>
      set((state) => ({ ...state, isOpen: true, postId })),
    onClose: () => set((state) => ({ ...state, isOpen: false, postId: -1 })),
  },
}));

export const usePostLikeModalActions = () =>
  usePostLikeModalStore((state) => state.actions);

export const usePostLikeModalIsOpen = () =>
  usePostLikeModalStore((state) => state.isOpen);

export const useGetSelectedPostLikeId = () =>
  usePostLikeModalStore((state) => state.postId);
