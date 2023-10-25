import IconButton from "@/components/button/icon-button";
import { useShowUserMenu } from "@/stores/user-menu-store";
import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function UserMenuTrigger(props: ButtonProps) {
  const onOpen = useShowUserMenu();

  return (
    <IconButton {...props} onClick={onOpen}>
      <FiMoreVertical />
    </IconButton>
  );
}
