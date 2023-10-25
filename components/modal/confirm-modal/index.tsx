"use client";
import React from "react";
import ModalLayout from "../layout";
import { Button } from "@nextui-org/button";
import { useConfirmState } from "@/stores/confirm-store";
import { TypographyH4 } from "@/components/ui/typography";
import { Image } from "@nextui-org/image";
import clsx from "clsx";

export default function ConfirmModal() {
  const {
    closeColor,
    closeLabel,
    closeVariant,
    onClose,
    confirmColor,
    confirmLabel,
    confirmVariant,
    onConfirm,
    onCancel,
    isOpen,
    body,
    title,
    imgSrc,
    imageClassName,
    size,
    modalClassNames,
    modalWrapperClassNames,
  } = useConfirmState();
  return (
    <ModalLayout
      key={body ?? "" + title ?? ""}
      isOpen={isOpen}
      placement="center"
      onClose={() => {
        onCancel();
        onClose();
      }}
      wrapperClassNames={{ ...modalWrapperClassNames }}
      size={size}
      classNames={{
        footer: clsx("px-4", modalClassNames?.footer),
        wrapper: clsx("w-[90%]", modalClassNames?.wrapper),
        ...modalClassNames,
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            color={closeColor}
            variant={closeVariant}
            onClick={() => {
              onCancel();
              onClose();
            }}
          >
            {closeLabel}
          </Button>
          <Button
            color={confirmColor}
            variant={confirmVariant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <TypographyH4>{title}</TypographyH4>
      {body}
      {imgSrc && (
        <Image
          removeWrapper
          src={imgSrc}
          width={150}
          height={150}
          alt="profile image"
          className={clsx("w-full h-auto max-w-[170px]", imageClassName)}
        />
      )}
    </ModalLayout>
  );
}
