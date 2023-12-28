"use client";

import IconButton from "@/components/button/icon-button";
import { useParticipantMenuActions } from "@/stores/participant-menu-store";
import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";

export default function ParticipantMenuTrigger({
  participantId,
  onClick,
  ref,
  ...rest
}: { participantId: number } & ButtonProps) {
  const { onOpen } = useParticipantMenuActions();

  return (
    <IconButton onClick={() => onOpen(participantId)} {...rest}>
      <FiMoreHorizontal />
    </IconButton>
  );
}
