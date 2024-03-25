"use client";

import { ReportType } from "@/types";
import { create } from "zustand";

type State = {
  isOpen: boolean;
  type: ReportType | null;
  id: number | null;
};

type Actions = {
  onOpen: (type: ReportType, id: number) => void;
  onClose: () => void;
};

const useReportModalStore = create<State & { actions: Actions }>((set) => ({
  actions: {
    onClose: () =>
      set((state) => ({ ...state, isOpen: false, type: null, id: null })),
    onOpen: (type, id) =>
      set((state) => ({ ...state, isOpen: true, type, id })),
  },
  type: null,
  id: null,
  isOpen: false,
}));

export const useReportModalActions = () =>
  useReportModalStore((state) => state.actions);
export const useReportModalIsOpen = () =>
  useReportModalStore((state) => state.isOpen);
export const useGetReportType = () =>
  useReportModalStore((state) => state.type);
export const useGetReportId = () => useReportModalStore((state) => state.id);
