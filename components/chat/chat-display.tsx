import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import React from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Time from "../time";
import { Chip } from "@nextui-org/chip";
import Link from "next/link";

export default function ChatDisplay({ isOnline }: { isOnline?: boolean }) {
  return (
    <Link
      href="/chats/1"
      className="flex gap-3 w-full justify-between items-center last:border-none border-b-1 border-divider py-2"
    >
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
      <div className="flex gap-2 w-[80%] justify-between items-center">
        <div className="flex flex-col max-w-[80%] w-[80%] truncate">
          <div className="flex gap-3 items-center">
            <TypographyLarge className="!text-base truncate">
              John Doe
            </TypographyLarge>
            <Chip className="text-[0.625rem]" color="danger" size="sm">
              5
            </Chip>
          </div>
          <TypographyMuted className="!text-xs truncate">
            Hello World! want to discuss more bout
            tomorrow?lllllllllllllllllllllllllllll
          </TypographyMuted>
        </div>
        <Time
          date={new Date(Date.now() - 3000000000)}
          className="w-[20%] !text-[0.75rem] self-start text-right"
        />
      </div>
    </Link>
  );
}
