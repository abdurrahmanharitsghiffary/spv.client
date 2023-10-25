import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { TypographyLarge } from "../ui/typography";
import { Badge } from "@nextui-org/badge";

export default function ChatAvatar({ isOnline }: { isOnline?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <Badge content="" color="success" shape="circle" placement="bottom-right">
        <Avatar
          className="w-14 h-14"
          name="John Doe"
          src="https://images.unsplash.com/photo-1695063536714-827da66eeb65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
        />
      </Badge>

      <TypographyLarge className="!text-xs truncate">John Doe</TypographyLarge>
    </div>
  );
}
