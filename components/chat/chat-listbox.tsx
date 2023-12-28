"use client";
import { ChatRoom } from "@/types/chat";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { useSession } from "@/stores/auth-store";
import Time from "../time";
import { listboxUserBaseProps } from "../user/listbox-user-props";
import { Chip } from "@nextui-org/chip";
import { MdGroups } from "react-icons/md";
import { Badge } from "@nextui-org/badge";

export default function ChatListbox({ chats }: { chats: ChatRoom[] }) {
  const session = useSession();

  const totalUnreadMessages = (chat: ChatRoom) => chat.unreadMessages.total;
  return (
    <Listbox items={chats} className="p-2" hideEmptyContent>
      {(chat) => {
        const user = chat.participants?.users?.find(
          (user) => user?.id !== session?.id
        );
        const title = chat.isGroupChat
          ? chat?.title || `Group chat #${chat?.id}`
          : user?.fullName;
        const description =
          chat?.messages?.[0]?.message ?? "Start conversation";

        const roomPicture = chat?.isGroupChat
          ? chat?.picture?.src
          : user?.avatarImage?.src;

        return (
          <ListboxItem
            showDivider
            key={chat?.id}
            startContent={
              <div className="flex-shrink-0">
                <Badge
                  color="success"
                  content=""
                  isInvisible={chat?.isGroupChat || !user?.isOnline}
                  placement="bottom-right"
                >
                  <Avatar
                    showFallback
                    fallback={
                      chat?.isGroupChat ? <MdGroups size={22} /> : undefined
                    }
                    name={chat?.isGroupChat ? "" : title ?? ""}
                    src={roomPicture}
                  />
                </Badge>
              </div>
            }
            description={description}
            endContent={
              <div className="max-w-[35%] flex flex-col gap-2 justify-center items-end">
                {chat?.isGroupChat && (
                  <span className="text-tiny rounded-sm py-[1px] bg-secondary/80 text-secondary-foreground px-2 text-center">
                    Group
                  </span>
                )}
                <Time
                  date={chat?.messages?.[0]?.createdAt ?? chat?.createdAt}
                  className="!text-xs text-right h-full"
                />
              </div>
            }
            classNames={{
              ...listboxUserBaseProps.classNames,
              base: "justify-start w-full",
            }}
            href={`/chats/${chat?.id}`}
          >
            {title}{" "}
            {chat.unreadMessages.total > 0 ? (
              <Chip color="danger" classNames={{ avatar: "ml-1" }} size="sm">
                {totalUnreadMessages(chat) > 99
                  ? "99+"
                  : totalUnreadMessages(chat)}
              </Chip>
            ) : null}
          </ListboxItem>
        );
      }}
    </Listbox>
  );
}
