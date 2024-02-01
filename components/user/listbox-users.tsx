import { UserSimplified } from "@/types/user";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React from "react";
import { listboxUserProps } from "./listbox-user-props";
import FollowButton from "../button/follow-button";
import clsx from "clsx";

export default function ListboxUsers({
  users,
  emptyContent,
  itemClassName,
}: {
  users: UserSimplified[];
  emptyContent?: React.ReactNode;
  itemClassName?: string;
}) {
  return (
    <Listbox
      aria-label="users"
      items={users}
      className="p-2"
      classNames={{ list: "gap-4", emptyContent: "text-sm" }}
      emptyContent={emptyContent}
    >
      {(item) => (
        <ListboxItem
          textValue={item?.fullName!}
          href={`/users/${item?.id}`}
          key={item?.id}
          {...listboxUserProps(item)}
          className={clsx(itemClassName)}
          endContent={<FollowButton size="sm" userId={item?.id} />}
        />
      )}
    </Listbox>
  );
}
