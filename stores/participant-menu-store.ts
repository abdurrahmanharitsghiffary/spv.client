"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
  participantId: number;
};

type Action = {
  onOpen: (participantId: number) => void;
  onClose: () => void;
};

const useParticipantMenuStore = create<State & { actions: Action }>((set) => ({
  isOpen: false,
  participantId: -1,
  actions: {
    onOpen: (participantId) =>
      set((state) => ({ ...state, isOpen: true, participantId })),
    onClose: () => set((state) => ({ ...state, isOpen: false })),
  },
}));

export const useParticipantMenuId = () => {
  useParticipantMenuStore((state) => state.participantId);
};

export const useParticipantMenuActions = () =>
  useParticipantMenuStore((state) => state.actions);

export const useParticipantMenuIsOpen = () =>
  useParticipantMenuStore((state) => state.isOpen);
