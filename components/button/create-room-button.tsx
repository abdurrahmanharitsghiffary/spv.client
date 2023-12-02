"use client";
import { useCreateRoomActions } from "@/stores/create-room-store";
import { Button } from "@nextui-org/button";
import React from "react";
import { FiPlus } from "react-icons/fi";

export default function CreateRoomButton({
  className,
}: {
  className?: string;
}) {
  const { onOpen } = useCreateRoomActions();
  return (
    <Button
      color="primary"
      isIconOnly
      radius="full"
      onClick={onOpen}
      className={className}
    >
      <FiPlus size={18} />
    </Button>
  );
}
