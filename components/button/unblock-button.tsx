"use client";
import { useUnblockUser } from "@/lib/api/users/mutation";
import { useConfirm } from "@/stores/confirm-store";
import { Button, ButtonProps } from "@nextui-org/button";
import clsx from "clsx";
import React from "react";

export default function UnblockButton({
  userId,
  className,
  ...rest
}: ButtonProps & { userId: number }) {
  const { unblockAsync } = useUnblockUser();
  const confirm = useConfirm();

  const handleBlocked = async () => {
    await confirm({
      body: "Are you sure unblock this user?",
      title: "Unblock",
      confirmLabel: "Confirm",
      confirmColor: "primary",
    });
    await unblockAsync({ userId });
  };

  return (
    <Button
      className={clsx("font-semibold", className)}
      {...rest}
      onClick={handleBlocked}
    >
      Unblock
    </Button>
  );
}
