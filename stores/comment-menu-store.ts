"use client";

import { CommentId } from "@/types/comment";
import { useCallback } from "react";
import { create } from "zustand";

type State = {
  isOpen: boolean;
  comment: CommentId | null;
};

type Action = {
  setComment: (comment: CommentId | null) => void;
  onOpen: () => void;
  onClose: () => void;
};

export const useCommentMenuStore = create<State & Action>((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
  comment: null,
  setComment: (comment) =>
    set((state) => ({
      ...state,
      comment: comment === null ? null : { ...state.comment, ...comment },
    })),
}));

export const useShowCommentMenu = () => {
  const open = useCommentMenuStore((state) => state.onOpen);
  const setComment = useSetSelectedComment();

  return useCallback((comment: CommentId | null) => {
    setComment(comment);
    open();
  }, []);
};

export const useHideCommentMenu = () => {
  const close = useCommentMenuStore((state) => state.onClose);
  const setComment = useSetSelectedComment();

  return useCallback(() => {
    setComment(null);
    close();
  }, []);
};

export const useCommentMenuIsOpen = () =>
  useCommentMenuStore((state) => state.isOpen);

export const useGetSelectedComment = () =>
  useCommentMenuStore((state) => state.comment);

export const useSetSelectedComment = () =>
  useCommentMenuStore((state) => state.setComment);
