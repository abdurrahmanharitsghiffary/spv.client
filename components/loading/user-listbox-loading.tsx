import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { listboxUserProps } from "../user/listbox-user-props";
import { Skeleton } from "@nextui-org/react";

export default function UserListboxLoading({
  items = [1, 2, 3],
  showDivider = false,
}: {
  items?: number[];
  showDivider?: boolean;
}) {
  return (
    <Listbox className="gap-2">
      {items.map((i) => (
        <ListboxItem
          {...listboxUserProps}
          key={i}
          startContent={
            <div className="flex-shrink-0">
              <Avatar />
            </div>
          }
          showDivider={showDivider}
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-[50%] rounded-medium" />
            <Skeleton className="h-2 w-[40%] rounded-medium" />
          </div>
        </ListboxItem>
      ))}
    </Listbox>
  );
}
