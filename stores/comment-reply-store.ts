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

export const useReplyStore = create<State & Action>((set) => ({
  id: null,
  setSelectedCommentReplyId: (id) => set((state) => ({ ...state, id })),
  setSelectedCommentReplyUsername: (username) =>
    set((state) => ({ ...state, username })),
}));

export const useGetSelectedCommentReplyId = () =>
  useReplyStore((state) => state.id);
export const useSetSeletedCommentReplyId = () => {
  const setReplyId = useReplyStore((state) => state.setSelectedCommentReplyId);

  return useCallback((id: number | null) => setReplyId(id), []);
};

export const useSetSeletedCommentReplyUsername = () => {
  const setReplyUsername = useReplyStore(
    (state) => state.setSelectedCommentReplyUsername
  );

  return useCallback((username?: string) => setReplyUsername(username), []);
};

export const useResetReplyValue = () => {
  const sId = useSetSeletedCommentReplyId();
  const sUsername = useSetSeletedCommentReplyUsername();

  return useCallback(() => {
    sId(null);
    sUsername(undefined);
  }, []);
};
