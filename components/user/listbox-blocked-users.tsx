import { UserSimplified } from "@/types/user";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React from "react";
import { listboxUserProps } from "./listbox-user-props";
import UnblockButton from "../button/unblock-button";
import Empty from "../empty";

export default function ListboxBlockedUsers({
  users,
  emptyContent,
}: {
  users: UserSimplified[];
  emptyContent?: React.ReactNode;
}) {
  return (
    <Listbox
      items={users}
      emptyContent={emptyContent ?? <Empty>No user blocked.</Empty>}
      className="p-2"
      classNames={{ list: "gap-4" }}
    >
      {(item) => (
        <ListboxItem
          key={item?.id}
          {...listboxUserProps(item)}
          endContent={<UnblockButton userId={item?.id} size="sm" />}
        />
      )}
    </Listbox>
  );
}
