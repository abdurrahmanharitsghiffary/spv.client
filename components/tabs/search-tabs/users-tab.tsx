import UsersGridLayout from "@/components/layout/users-grid-layout";
import UserCard from "@/components/user/user-card";
import UserCardSkeleton from "@/components/user/user-card-skeleton";
import { UserAccountPublic, UserSimplifiedV2 } from "@/types/user";
import React, { useMemo } from "react";

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
  const usersData: UserSimplifiedV2[] = useMemo(
    () =>
      users?.map((user) => ({
        firstName: user?.firstName,
        id: user?.id,
        lastName: user?.lastName,
        image: user?.profile?.image,
        username: user?.username,
      })) ?? [],
    [users]
  );

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
