"use client";
import React, { forwardRef } from "react";
import ModalLayout, { ModalLayoutProps } from "./layout";
import IconButton from "../button/icon-button";
import { BiChevronLeft, BiX } from "react-icons/bi";
import { Divider } from "@nextui-org/divider";
import clsx from "clsx";
import { useIsSm } from "@/hooks/use-media-query";

const ModalLayoutV2 = forwardRef(
  (
    {
      children,
      classNames,
      wrapperClassNames,
      header,
      placement,
      size,
      closeButton,
      ...rest
    }: ModalLayoutProps,
    ref: React.Ref<HTMLElement> | undefined
  ) => {
    const isSm = useIsSm();

    return (
      <ModalLayout
        {...rest}
        ref={ref}
        header={<Divider className="w-full" />}
        classNames={{
          wrapper: clsx(
            "h-full max-h-none sm:h-auto bg-background",
            classNames?.wrapper
          ),
          header: clsx(
            "p-0 h-[64px] sm:h-[50px] items-end",
            classNames?.header
          ),
          footer: clsx("p-4", classNames?.footer),
          body: clsx("hide-scrollbar max-w-none sm:p-4", classNames?.body),
          content: classNames?.content,
          modalBtn: classNames?.modalBtn,
        }}
        wrapperClassNames={{
          wrapper: "z-[201] sm:!items-start",
          closeButton: clsx(
            "left-2 top-[12px] sm:left-auto sm:top-[5px]",
            wrapperClassNames?.closeButton
          ),
          ...wrapperClassNames,
        }}
        closeButton={
          <IconButton>
            <BiChevronLeft className="sm:hidden" />
            <BiX className="hidden sm:inline" />
          </IconButton>
        }
        scrollBehavior="inside"
        placement={"center"}
        size={isSm ? "md" : "full"}
      >
        {children}
      </ModalLayout>
    );
  }
);

ModalLayoutV2.displayName = "ModalLayoutV2";

export default ModalLayoutV2;
