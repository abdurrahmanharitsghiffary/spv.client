import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import React from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Time from "../time";
import Link from "next/link";
import { Chip } from "@nextui-org/chip";
import { ChatRoom } from "@/types/chat";
import { useSession } from "@/stores/auth-store";

export default function ChatDisplay({ chat }: { chat: ChatRoom }) {
  const session = useSession();
  const user = chat.participants.users.filter(
    (user) => user.id !== session?.id
  )?.[0];
  console.log(chat, "Chat");
  return (
    <Link
      href={`/chats/${chat?.id}`}
      className="flex gap-1 w-full px-4 justify-between items-center last:border-none border-b-1 border-divider py-2 max-h-[57px]"
    >
      {chat.isGroupChat ? (
        <UserAvatar
          name={chat.title || "Group chat #" + chat.id}
          src={chat.picture?.src}
        />
      ) : (
        <UserAvatar
          name={user?.fullName ?? ""}
          src={user?.avatarImage?.src}
          isOnline={user?.isOnline}
        />
      )}
      <div className="flex gap-2 w-[80%] justify-between items-center">
        <div className="flex flex-col max-w-[80%] w-[80%] truncate">
          <div className="flex gap-3 items-center max-h-full">
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
            {chat?.messages?.[0]?.message}
          </TypographyMuted>
        </div>
        <Time
          date={chat?.messages?.[0]?.createdAt ?? chat?.createdAt}
          className="w-[20%] !text-[0.75rem] self-start text-right"
        />
      </div>
    </Link>
  );
}

function UserAvatar({
  name,
  isOnline,
  src,
}: {
  name: string;
  isOnline?: boolean;
  src?: string;
}) {
  if (isOnline)
    return (
      <Badge content="" color="success" shape="circle" placement="bottom-right">
        <Avatar
          size="md"
          name={name ?? ""}
          src={src ?? ""}
          className="flex-shrink-0"
        />
      </Badge>
    );

  return (
    <Avatar
      size="md"
      name={name ?? ""}
      src={src ?? ""}
      className="flex-shrink-0"
    />
  );
}
