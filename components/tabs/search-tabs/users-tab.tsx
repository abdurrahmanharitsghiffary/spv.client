import UserListboxLoading from "@/components/loading/user-listbox-loading";
import ListboxUsers from "@/components/user/listbox-users";
import { UserAccountPublic, UserSimplified } from "@/types/user";
import React from "react";

export function UserTabLoading() {
  return <UserListboxLoading />;
}

export default function UsersTab({ users }: { users: UserAccountPublic[] }) {
  // USE MEMO ??
  const usersData: UserSimplified[] =
    users?.map((user) => ({
      isOnline: user?.isOnline,
      firstName: user?.firstName,
      id: user?.id,
      fullName: user?.fullName,
      lastName: user?.lastName,
      avatarImage: user?.profile?.avatarImage,
      username: user?.username,
    })) ?? [];

  return <ListboxUsers emptyContent="No user found." users={usersData} />;
}
