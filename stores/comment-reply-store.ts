"use client";

import { useCallback } from "react";
import { create } from "zustand";

type State = {
  id: number | null;
  username?: string;
};

type Action = {
  setSelectedCommentReplyUsername: (username?: string) => void;
  setSelectedCommentReplyId: (id: number | null) => void;
};

export const useReplyStore = create<State & { actions: Action }>((set) => ({
  id: null,
  actions: {
    setSelectedCommentReplyId: (id) => set((state) => ({ ...state, id })),
    setSelectedCommentReplyUsername: (username) =>
      set((state) => ({ ...state, username })),
  },
}));

export const useGetSelectedCommentReplyId = () =>
  useReplyStore((state) => state.id);

export const useGetSelectedCommentReplyUsername = () =>
  useReplyStore((state) => state.username);

export const useCommentReplyActions = () =>
  useReplyStore((state) => state.actions);

export const useResetReplyValue = () => {
  const { setSelectedCommentReplyId, setSelectedCommentReplyUsername } =
    useCommentReplyActions();

  return useCallback(() => {
    setSelectedCommentReplyId(null);
    setSelectedCommentReplyUsername(undefined);
  }, []);
};
