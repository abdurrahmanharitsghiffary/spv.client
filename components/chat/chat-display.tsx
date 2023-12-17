"use client";
import React from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Time from "../time";
import Link from "next/link";
import { Chip } from "@nextui-org/chip";
import { ChatRoom } from "@/types/chat";
import { useSession } from "@/stores/auth-store";
import UserAvatar from "../user/user-avatar";

export default function ChatDisplay({ chat }: { chat: ChatRoom }) {
  const session = useSession();
  const user = chat.participants.users.filter(
    (user) => user.id !== session?.id
  )?.[0];
  return (
    <Link
      href={`/chats/${chat?.id}`}
      className="flex gap-1 w-full px-4 justify-between last:border-none border-b-1 border-divider py-2 max-h-[65px]"
    >
      <div className="flex justify-center items-center w-fit flex-shrink-0">
        <UserAvatar
          name={
            chat.isGroupChat
              ? chat.title || "Group chat #" + chat.id
              : user?.fullName ?? ""
          }
          src={chat.isGroupChat ? chat.picture?.src : user?.avatarImage?.src}
          isOnline={chat.isGroupChat ? false : user?.isOnline}
        />
      </div>
      <div className="flex gap-2 w-[80%] justify-between">
        <div className="flex flex-col max-w-[80%] w-[80%] truncate justify-center">
          <div className="flex gap-3 items-start max-h-full">
            <TypographyLarge className="!text-base !font-semibold truncate">
              {chat.isGroupChat
                ? chat.title || "Group chat #" + chat.id
                : user?.fullName}
            </TypographyLarge>
            {chat.unreadMessages.total > 0 ? (
              <Chip
                className="text-[0.625rem] w-fit h-fit p-1"
                color="danger"
                size="sm"
              >
                {chat.unreadMessages.total}
              </Chip>
            ) : null}
          </div>
          <TypographyMuted className="!text-xs truncate">
            {chat?.messages?.[0]?.message ?? "Start conversation"}
          </TypographyMuted>
        </div>
        <div className="flex flex-col gap-1 justify-center items-end">
          {chat.isGroupChat && (
            <span className="text-tiny rounded-sm py-[1px] bg-secondary/80 text-secondary-foreground px-2 text-center">
              Group
            </span>
          )}
          <Time
            date={chat?.messages?.[0]?.createdAt ?? chat?.createdAt}
            className="!text-xs text-right h-full"
          />
        </div>
      </div>
    </Link>
  );
}
