"use client";

import { Chip } from "@nextui-org/chip";
import { useDisclosure } from "@nextui-org/use-disclosure";
import React, { useState } from "react";
import UserTooltip from "./user-tooltip";
import { UserSimplified, UserSimplifiedWF } from "@/types/user";

export default function UserChip({
  children,
  onCloseClick,
  user,
}: {
  user: UserSimplifiedWF | UserSimplified;
  onCloseClick?: (user: UserSimplifiedWF | UserSimplified) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <UserTooltip isOpen={isOpen} onOpen={(open) => setIsOpen(open)} user={user}>
      <Chip
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onClose={() => {
          if (!onCloseClick) return null;
          onCloseClick(user);
        }}
        isCloseable={onCloseClick !== undefined}
      >
        {children}
      </Chip>
    </UserTooltip>
  );
}
