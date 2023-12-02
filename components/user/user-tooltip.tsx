"use client";

import { Tooltip } from "@nextui-org/tooltip";
import React from "react";
import UserCard from "./user-card";
import { UserSimplified, UserSimplifiedWF } from "@/types/user";

export default function UserTooltip({
  isOpen,
  onOpen,
  children,
  user,
}: {
  user: UserSimplifiedWF | UserSimplified;
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpen?: (isOpen: boolean) => void;
}) {
  return (
    <Tooltip
      isOpen={isOpen}
      onOpenChange={onOpen}
      classNames={{ base: "rounded-md h-auto" }}
      content={
        <UserCard
          className="bg-transparent shadow-none rounded-none border-none p-0 max-w-[190px] px-0"
          hideLink
          withFollowButton={false}
          user={user}
        />
      }
    >
      {children}
    </Tooltip>
  );
}
