"use client";

import { ListboxItem, Listbox } from "@nextui-org/listbox";
import React from "react";
import { UserChatRead } from "@/types/chat";
import Timestamp from "../timestamp";
import { UserSimplified } from "@/types/user";
import { listboxUserProps } from "./listbox-user-props";

export default function ListboxUsersRead({
  users,
}: {
  users: (UserSimplified | UserChatRead)[];
}) {
  return (
    <Listbox
      aria-label="users"
      emptyContent={""}
      className="p-0"
      classNames={{ list: "gap-2" }}
      items={users}
    >
      {(user) => (
        <ListboxItem
          textValue={user?.fullName!}
          key={user?.id}
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
          {...listboxUserProps(user)}
        />
      )}
    </Listbox>
  );
}
