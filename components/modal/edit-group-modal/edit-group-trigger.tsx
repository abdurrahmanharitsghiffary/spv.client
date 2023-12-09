"use client";

import { useEditGroupActions } from "@/stores/edit-group-store";
import { Button, ButtonProps } from "@nextui-org/button";
import React from "react";

export default function EditGroupTrigger({
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const { onOpen } = useEditGroupActions();
  return (
    <Button onClick={onOpen} {...rest}>
      {children ?? "Edit"}
    </Button>
  );
}
