"use client";
import { CommentId } from "@/types/comment";
import { useCallback } from "react";
import { create } from "zustand";

type State = {
  comment: CommentId | null;
  isOpen: boolean;
};

type Action = {
  setSelectedComment: (comment: CommentId | null) => void;
  onClose: () => void;
  onOpen: () => void;
};

export const useCommentEditStore = create<State & { actions: Action }>(
  (set) => ({
    comment: null,
    isOpen: false,
    actions: {
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      onClose: () => set((state) => ({ ...state, isOpen: false })),
      setSelectedComment: (comment) =>
        set((state) => ({
          ...state,
          comment: comment === null ? null : { ...state.comment, ...comment },
        })),
    },
  })
);

export const useShowCommentEditForm = () => {
  const { onOpen, setSelectedComment } = useCommentEditStore(
    (state) => state.actions
  );

  const handleOpen = useCallback((comment: CommentId) => {
    setSelectedComment(comment);
    onOpen();
  }, []);

  return handleOpen;
};

export const useHideCommentEditForm = () => {
  const { onClose, setSelectedComment } = useCommentEditStore(
    (state) => state.actions
  );

  const handleClose = useCallback(() => {
    setSelectedComment(null);
    onClose();
  }, []);

  return handleClose;
};

export const useGetSelectedEditComment = () =>
  useCommentEditStore((state) => state.comment);
