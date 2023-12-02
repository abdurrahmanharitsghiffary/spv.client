import UsersGridLayout from "@/components/layout/users-grid-layout";
import UserCard from "@/components/user/user-card";
import UserCardSkeleton from "@/components/user/user-card-skeleton";
import { UserAccountPublic, UserSimplified } from "@/types/user";
import React from "react";

export function UserTabLoading() {
  return (
    <UsersGridLayout>
      {[1, 2, 3].map((item) => (
        <UserCardSkeleton key={item} className="rounded-none shadow-none" />
      ))}
    </UsersGridLayout>
  );
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

  return (
    <UsersGridLayout>
      {usersData?.map((user) => (
        <UserCard
          user={user}
          key={user?.id}
          className="rounded-none shadow-none"
        />
      ))}
    </UsersGridLayout>
  );
}
