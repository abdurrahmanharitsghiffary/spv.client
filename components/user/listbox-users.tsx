import { UserSimplified } from "@/types/user";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React from "react";
import { listboxUserProps } from "./listbox-user-props";
import FollowButton from "../button/follow-button";

export default function ListboxUsers({
  users,
  emptyContent,
}: {
  users: UserSimplified[];
  emptyContent?: React.ReactNode;
}) {
  return (
    <Listbox
      items={users}
      className="p-2"
      classNames={{ list: "gap-4" }}
      emptyContent={emptyContent}
    >
      {(item) => (
        <ListboxItem
          href={`/users/${item?.id}`}
          key={item?.id}
          {...listboxUserProps(item)}
          endContent={<FollowButton size="sm" userId={item?.id} />}
        />
      )}
    </Listbox>
  );
}
