import {
  ListboxProps,
  Listbox,
  ListboxItem,
  ListboxItemProps,
} from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { listboxUserProps } from "../user/listbox-user-props";
import { Skeleton } from "@nextui-org/skeleton";
import { OmitCommonProps } from "@nextui-org/system";

export default function UserListboxLoading({
  items = [1, 2, 3],
  itemProps,
  showDivider = false,
  listProps,
}: {
  items?: number[];
  showDivider?: boolean;
  itemProps?: OmitCommonProps<ListboxItemProps, "key">;
  listProps?: OmitCommonProps<ListboxProps, "children">;
}) {
  return (
    <Listbox aria-label="loading..." className="gap-2" {...listProps}>
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
          {...itemProps}
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
