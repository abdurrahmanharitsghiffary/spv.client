"use client";

import { ListboxItem, Listbox } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { UserChatRead } from "@/types/chat";
import Timestamp from "../timestamp";
import { UserSimplified } from "@/types/user";

export default function ListboxUsers({
  users,
  ...rest
}: {
  users: (UserSimplified | UserChatRead)[];
}) {
  return (
    <Listbox className="p-0 gap-2" items={users}>
      {(user) => (
        <ListboxItem
          key={user?.id}
          startContent={
            <Avatar
              className="flex-shrink-0"
              src={user?.avatarImage?.src}
              name={user?.fullName ?? ""}
              showFallback
            />
          }
          endContent={
            (user as UserChatRead)?.readedAt && (
              <div className="self-end max-w-[30%]">
                <Timestamp
                  customFormat="ll"
                  className="!text-tiny !text-foreground-500 truncate"
                  customDate={(user as UserChatRead)?.readedAt}
                />
              </div>
            )
          }
          description={user?.username}
          classNames={{
            wrapper: "max-w-[70%] truncate",
            title: "max-w-full",
            description: "max-w-full",
          }}
          {...rest}
        >
          {user?.fullName}
        </ListboxItem>
      )}
    </Listbox>
  );
}
