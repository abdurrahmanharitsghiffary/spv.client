"use client";

import { Button } from "@nextui-org/button";
import UserCard from "./user-card";
import { FiCheck } from "react-icons/fi";
import IconButton from "../button/icon-button";
import clsx from "clsx";
import { UserSimplified } from "@/types/user";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { BiTrash } from "react-icons/bi";

export default function UserGroupList<TFieldValues extends FieldValues>({
  user,
  setValue,
  selectedUsers,
}: {
  user: UserSimplified & { role: "admin" | "user" };
  setValue: UseFormSetValue<TFieldValues>;
  selectedUsers: any;
}) {
  const handleRoleChange = () => {
    setValue(
      "participants" as any,
      selectedUsers.map((item: UserSimplified & { role: "admin" | "user" }) => {
        if (item.id === user.id) {
          return { ...item, role: item.role === "user" ? "admin" : "user" };
        }
        return item;
      })
    );
  };

  const handleCloseClick = () => {
    setValue(
      "participants" as any,
      selectedUsers.filter((item: any) => item.id !== user.id)
    );
  };

  return (
    <li className="flex gap-2 justify-between items-center pl-2">
      <UserCard
        user={user}
        hideLink
        withFollowButton={false}
        className="shadow-none rounded-none px-0"
        cardClassNames={{ body: "!px-0" }}
      />
      <Button
        variant={user.role === "admin" ? "flat" : "faded"}
        color={user.role === "user" ? "default" : "success"}
        size="sm"
        endContent={
          user.role === "admin" && (
            <div className="text-[0.875rem]">
              <FiCheck />
            </div>
          )
        }
        onClick={handleRoleChange}
        className={clsx("capitalize", user.role === "admin" && "px-6")}
      >
        Admin
      </Button>
      <IconButton
        size="sm"
        color="danger"
        variant="flat"
        onClick={handleCloseClick}
      >
        <BiTrash size={16} />
      </IconButton>
    </li>
  );
}
