"use client";
import { DisclosureMinified } from "@/types";
import { ButtonProps, SlotsToClasses } from "@nextui-org/react";
import { useCallback } from "react";
import { create } from "zustand";

export type ConfirmState = {
  closeVariant?: ButtonProps["variant"];
  closeColor?: ButtonProps["color"];
  closeLabel?: string;
  confirmLabel?: string;
  body?: string;
  title?: string;
  imgSrc?: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "full"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | undefined;
  modalWrapperClassNames?: SlotsToClasses<
    | "base"
    | "header"
    | "body"
    | "footer"
    | "wrapper"
    | "closeButton"
    | "backdrop"
  >;
  modalClassNames?:
    | {
        body?: string | undefined;
        footer?: string | undefined;
        wrapper?: string | undefined;
        header?: string | undefined;
        content?: string | undefined;
        modalBtn?: string | undefined;
      }
    | undefined;
  confirmVariant?: ButtonProps["variant"];
  confirmColor?: ButtonProps["color"];
  imageClassName?: string;
};

type Action = {
  onConfirm: () => void;
  onCancel: () => void;
  setState: (
    newState: ConfirmState & {
      isOpen?: boolean;
      onConfirm?: Action["onConfirm"];
      onCancel?: Action["onCancel"];
    }
  ) => void;
};

const useConfirmStore = create<DisclosureMinified & ConfirmState & Action>(
  (set) => {
    return {
      isOpen: false,
      setState: (newState) => set((state) => ({ ...state, ...newState })),
      onClose: () =>
        set((state) => ({
          ...state,
          isOpen: false,
          closeVariant: "solid",
          closeLabel: "Cancel",
          confirmLabel: "Confirm",
          body: "",
          title: "",
          confirmVariant: "solid",
          closeColor: "default",
          confirmColor: "primary",
          modalClassNames: {},
          modalWrapperClassNames: {},
          size: "md",
          imgSrc: "",
          imageClassName: "",
        })),
      onOpen: () => set((state) => ({ ...state, isOpen: true })),
      onConfirm: () => {},
      onCancel: () => {},
      imageClassName: "",
      closeVariant: "solid",
      closeLabel: "Cancel",
      confirmLabel: "Confirm",
      body: "",
      title: "",
      size: "md",
      imgSrc: "",
      modalClassNames: {},
      modalWrapperClassNames: {},
      confirmVariant: "solid",
      closeColor: "default",
      confirmColor: "primary",
    };
  }
);

export const useConfirmState = () => useConfirmStore((state) => state);

export const useConfirm = () => {
  const setState = useConfirmStore((state) => state.setState);

  const confirm: (confirmOptions?: ConfirmState) => Promise<boolean> =
    useCallback((confirmOptions) => {
      return new Promise((resolve, reject) => {
        setState({ ...confirmOptions, isOpen: true });

        setState({
          onConfirm: () => resolve(true),
          onCancel: () => reject(false),
        });
      });
    }, []);

  return confirm;
};
