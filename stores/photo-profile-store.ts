import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Action = {
  onOpen: () => void;
  onClose: () => void;
};

const usePhotoProfile = create<State & Action>((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
}));

export const useShowPhotoProfileMenu = () =>
  usePhotoProfile((state) => state.onOpen);

export const useHidePhotoProfileMenu = () =>
  usePhotoProfile((state) => state.onClose);

export const usePhotoProfileMenuIsOpen = () =>
  usePhotoProfile((state) => state.isOpen);
