"use client";
import { UserGroup } from "@/types/user";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React, { useCallback } from "react";
import IconButton from "../button/icon-button";
import { listboxUserProps } from "./listbox-user-props";
import { BiTrash } from "react-icons/bi";

type Props = {
  users: UserGroup[];
  onCloseClick?: (user: UserGroup) => void;
};

export default function UserGroupLists({ users, onCloseClick }: Props) {
  const handleCloseClick = useCallback(
    (user: UserGroup) => {
      if (!onCloseClick) return null;
      onCloseClick(user);
    },
    [onCloseClick]
  );

  return (
    <Listbox
      items={users}
      className="px-0"
      classNames={{ emptyContent: "text-small" }}
      emptyContent="No users selected."
    >
      {(user) => (
        <ListboxItem
          textValue={user?.fullName!}
          key={user?.id}
          {...listboxUserProps(user)}
          endContent={
            <div className="w-[20%] flex flex-col gap-2 items-end">
              <IconButton
                size="sm"
                color="danger"
                variant="flat"
                onClick={() => handleCloseClick(user)}
              >
                <BiTrash size={16} />
              </IconButton>
            </div>
          }
          classNames={{
            wrapper: "max-w-[80%] truncate",
            title: "max-w-full",
            description: "max-w-full",
          }}
        />
      )}
    </Listbox>
  );
}
