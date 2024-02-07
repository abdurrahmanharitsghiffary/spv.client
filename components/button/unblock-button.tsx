"use client";
import { useSocket } from "@/hooks/use-socket";
import { useUnblockUser } from "@/lib/api/users/mutation";
import { Socket_Event } from "@/lib/socket-event";
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
    console.log("Blocked");
    await confirm({
      body: "Are you sure unblock this user?",
      title: "Unblock",
      confirmLabel: "Confirm",
      confirmColor: "primary",
    });
    console.log("Confirmed");
    await unblockAsync({ params: { userId } });
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
