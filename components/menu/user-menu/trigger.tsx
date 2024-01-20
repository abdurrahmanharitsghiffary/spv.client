import IconButton from "@/components/button/icon-button";
import { useUserMenuActions } from "@/stores/user-menu-store";
import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function UserMenuTrigger({ ref, ...props }: ButtonProps) {
  const { onOpen } = useUserMenuActions();

  return (
    <IconButton {...props} variant="solid" radius="md" onClick={onOpen}>
      <FiMoreVertical />
    </IconButton>
  );
}
