"use client";

import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbMessageCirclePlus } from "react-icons/tb";
import SpeedDial from ".";
import { useCreateGroupActions } from "@/stores/create-group-store";
import { useCreateRoomActions } from "@/stores/create-room-store";

export default function CreateRoomSpeedDial() {
  const { onOpen: openGroup } = useCreateGroupActions();
  const { onOpen: openRoom } = useCreateRoomActions();

  return (
    <SpeedDial
      className="fixed bottom-16 right-4"
      onAction={(key) => {
        switch (key) {
          case "group-add": {
            return openGroup();
          }
          case "message-add": {
            return openRoom();
          }
        }
      }}
      items={[
        {
          icon: <AiOutlineUsergroupAdd />,
          key: "group-add",
          content: "Create group chat",
        },
        {
          icon: <TbMessageCirclePlus />,
          key: "message-add",
          content: "Start conversation",
        },
      ]}
    />
  );
}
