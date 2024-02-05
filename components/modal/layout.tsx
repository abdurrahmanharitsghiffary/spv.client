"use client";
import React, { forwardRef, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "@nextui-org/modal";
import { SlotsToClasses } from "@nextui-org/theme";
import { HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export interface ModalLayoutProps {
  id?: string;
  wrapperClassNames?: SlotsToClasses<
    | "header"
    | "footer"
    | "base"
    | "body"
    | "backdrop"
    | "wrapper"
    | "closeButton"
  >;
  bodyOnClick?: () => void;
  scrollBehavior?: "outside" | "inside" | "normal";
  placement?:
    | "center"
    | "auto"
    | "top"
    | "bottom"
    | "top-center"
    | "bottom-center"
    | undefined;
  classNames?: {
    body?: string;
    footer?: string;
    wrapper?: string;
    header?: string;
    content?: string;
    modalBtn?: string;
  };
  backdrop?: "blur" | "transparent" | "opaque" | undefined;
  hideCloseButton?: boolean;
  onClose: () => void;
  isOpen: boolean;
  footer?: string | React.JSX.Element;
  header?: string | React.JSX.Element;
  children: React.ReactNode;
  shouldCloseOnUrlChange?: boolean;
  size?:
    | "md"
    | "sm"
    | "lg"
    | "xl"
    | "2xl"
    | "full"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl";
  closeButton?: any;
  motionProps?: HTMLMotionProps<"section">;
}

const ModalLayout = forwardRef(
  (
    {
      shouldCloseOnUrlChange = true,
      wrapperClassNames,
      id,
      classNames,
      header,
      size,
      footer,
      children,
      scrollBehavior,
      isOpen,
      onClose,
      hideCloseButton,
      placement,
      motionProps,
      closeButton,
      backdrop,
      bodyOnClick = () => {},
    }: ModalLayoutProps,
    ref: React.Ref<HTMLElement | null>
  ) => {
    const pathname = usePathname();
    const handleClose = () => {
      const toastElement: any = document.querySelector(".Toastify");
      const clickedToast = event?.composedPath()?.includes(toastElement);
      if (clickedToast) {
        return;
      }
      onClose();
    };

    useEffect(() => {
      if (!shouldCloseOnUrlChange) return;
      if (pathname) {
        handleClose();
      }
    }, [pathname, shouldCloseOnUrlChange]);

    return (
      <Modal
        motionProps={motionProps}
        shouldBlockScroll
        ref={ref}
        backdrop={backdrop}
        id={id}
        isDismissable
        hideCloseButton={hideCloseButton}
        scrollBehavior={scrollBehavior}
        classNames={{
          ...wrapperClassNames,
          wrapper: clsx(wrapperClassNames?.wrapper, "z-[201]"),
          backdrop: clsx(wrapperClassNames?.backdrop, "z-[201]"),
        }}
        closeButton={closeButton}
        placement={placement}
        className={" my-0 h-auto " + classNames?.wrapper ?? ""}
        size={size ? size : "md"}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalContent className={classNames?.content ?? ""}>
          <ModalHeader className={classNames?.header ?? ""}>
            {header}
          </ModalHeader>
          <ModalBody onClick={bodyOnClick} className={classNames?.body ?? ""}>
            {children}
          </ModalBody>
          {footer && (
            <ModalFooter className={classNames?.footer ?? ""}>
              {footer}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    );
  }
);

ModalLayout.displayName = "ModalLayout";
export default ModalLayout;
