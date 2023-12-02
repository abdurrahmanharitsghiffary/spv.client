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

export const useCommentMenuStore = create<State & { actions: Action }>(
  (set) => ({
    isOpen: false,
    comment: null,
    actions: {
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      onClose: () => set((state) => ({ ...state, isOpen: false })),

      setComment: (comment) =>
        set((state) => ({
          ...state,
          comment: comment === null ? null : { ...state.comment, ...comment },
        })),
    },
  })
);

export const useShowCommentMenu = () => {
  const { setComment, onOpen: open } = useCommentActions();

  return useCallback((comment: CommentId | null) => {
    setComment(comment);
    open();
  }, []);
};

export const useHideCommentMenu = () => {
  const { setComment, onClose: close } = useCommentActions();

  return useCallback(() => {
    setComment(null);
    close();
  }, []);
};

export const useCommentMenuIsOpen = () =>
  useCommentMenuStore((state) => state.isOpen);

export const useGetSelectedComment = () =>
  useCommentMenuStore((state) => state.comment);

export const useCommentActions = () =>
  useCommentMenuStore((state) => state.actions);
