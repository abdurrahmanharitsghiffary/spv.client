import { UserSimplified } from "@/types/user";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React from "react";
import { listboxUserProps } from "./listbox-user-props";
import UnblockButton from "../button/unblock-button";

export default function ListboxBlockedUsers({
  users,
  emptyContent,
}: {
  users: UserSimplified[];
  emptyContent?: React.ReactNode;
}) {
  return (
    <Listbox
      aria-label="blocked users"
      items={users}
      emptyContent={emptyContent ?? "No user blocked."}
      className="p-2"
      classNames={{ list: "gap-4" }}
    >
      {(item) => (
        <ListboxItem
          textValue={item?.fullName!}
          key={item?.id}
          {...listboxUserProps(item)}
          endContent={<UnblockButton userId={item?.id} size="sm" />}
        />
      )}
    </Listbox>
  );
}
