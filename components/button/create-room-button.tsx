"use client";

import { useCreateGroupActions } from "@/stores/create-group-store";
import { useCreateRoomActions } from "@/stores/create-room-store";
import React from "react";
import IconButton from "./icon-button";
import { FiPlus } from "react-icons/fi";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
// nEED FIX
export default function CreateRoomButton() {
  const { onOpen: openGroup } = useCreateGroupActions();
  const { onOpen: openRoom } = useCreateRoomActions();
  const handleDropDownAction = (key: React.Key) => {
    switch (key) {
      case "group": {
        openGroup();
        return;
      }
      case "personal": {
        openRoom();
        return;
      }
    }
  };

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <IconButton color="primary" variant="solid">
            <FiPlus />
          </IconButton>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          onAction={handleDropDownAction}
        >
          <DropdownItem key="personal">New chat</DropdownItem>
          <DropdownItem key="group">New group</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
