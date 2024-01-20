"use client";
import { clsx } from "clsx";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import IconButton from "@/components/button/icon-button";
import { useGroupMenuActions } from "@/stores/group-menu-store";
import { ButtonProps } from "@nextui-org/button";
import { OmitCommonProps } from "@nextui-org/system";

export default function GroupMenuTrigger({
  className,
  ...rest
}: {
  className?: string;
} & OmitCommonProps<ButtonProps, "ref">) {
  const { onOpen } = useGroupMenuActions();
  const cl = clsx("", className);
  return (
    <IconButton onClick={onOpen} className={cl} {...rest}>
      <FiMoreVertical />
    </IconButton>
  );
}
