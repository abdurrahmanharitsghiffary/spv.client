"use client";
import { UserGroup } from "@/types/user";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React, { useCallback } from "react";
import IconButton from "../button/icon-button";
import { FiTrash } from "react-icons/fi";
import { listboxUserProps } from "./listbox-user-props";

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
    <Listbox items={users} className="px-0">
      {(user) => (
        <ListboxItem
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
                <FiTrash size={16} />
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
