"use client";
import { clsx } from "clsx";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useProfileMenuActions } from "@/stores/profile-menu-store";
import IconButton from "@/components/button/icon-button";

export default function ProfileMenuTrigger({
  className,
}: {
  className?: string;
}) {
  const { onOpen } = useProfileMenuActions();
  const cl = clsx("", className);
  return (
    <IconButton onClick={onOpen} className={cl}>
      <FiMoreVertical />
    </IconButton>
  );
}
