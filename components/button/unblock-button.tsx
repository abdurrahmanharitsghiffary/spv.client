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
  const socket = useSocket();

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
    if (socket && socket.connected) {
      socket.emit(Socket_Event.GET_MESSAGE_COUNT);
    }
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
