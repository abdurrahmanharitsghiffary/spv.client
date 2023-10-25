import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import React from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Time from "../time";

export default function ChatDisplay({ isOnline }: { isOnline?: boolean }) {
  return (
    <div className="flex gap-3 w-full items-center">
      {isOnline ? (
        <Badge
          content=""
          color="success"
          shape="circle"
          placement="bottom-right"
        >
          <Avatar
            className="w-12 h-12"
            name="John Doe"
            src="https://images.unsplash.com/photo-1695648259930-920a1b92bfed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
          />
        </Badge>
      ) : (
        <Avatar
          className="w-12 h-12"
          name="John Doe"
          src="https://images.unsplash.com/photo-1695648259930-920a1b92bfed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
        />
      )}
      <div className="flex flex-col gap-3 w-[80%]">
        <div className="flex w-full justify-between items-center">
          <TypographyLarge className="!text-base">John Doe</TypographyLarge>
          <Time date={new Date(Date.now())} />
        </div>
        <TypographyMuted className="!text-xs">
          Hello World! want to discuss more bout tomorrow?
        </TypographyMuted>
      </div>
    </div>
  );
}
