"use client";
import React, { forwardRef } from "react";
import ModalLayout, { ModalLayoutProps } from "./layout";
import IconButton from "../button/icon-button";
import { BiChevronLeft } from "react-icons/bi";
import { Divider } from "@nextui-org/divider";
import clsx from "clsx";

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
    return (
      <ModalLayout
        {...rest}
        ref={ref}
        header={<Divider className="w-full" />}
        classNames={{
          wrapper: clsx("h-full max-h-none bg-background", classNames?.wrapper),
          header: clsx("p-0 h-[64px] items-end", classNames?.header),
          footer: clsx("p-4", classNames?.footer),
          body: classNames?.body,
          content: classNames?.content,
          modalBtn: classNames?.modalBtn,
        }}
        wrapperClassNames={{
          closeButton: clsx(
            "left-2 top-[12px]",
            wrapperClassNames?.closeButton
          ),
          ...wrapperClassNames,
        }}
        closeButton={
          <IconButton>
            <BiChevronLeft />
          </IconButton>
        }
        scrollBehavior="inside"
        placement="center"
        size="full"
      >
        {children}
      </ModalLayout>
    );
  }
);

ModalLayoutV2.displayName = "ModalLayoutV2";

export default ModalLayoutV2;
