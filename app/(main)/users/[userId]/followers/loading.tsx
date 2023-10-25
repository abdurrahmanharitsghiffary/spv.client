import UsersGridLayout from "@/components/layout/users-grid-layout";
import UserCardSkeleton from "@/components/user/user-card-skeleton";
import React from "react";

export default function FollowersPageLoading() {
  return (
    <UsersGridLayout className="pt-8 px-2 pb-16">
      {[1, 2, 3, 4, 5].map((item) => (
        <UserCardSkeleton key={item} className="rounded-none shadow-none" />
      ))}
    </UsersGridLayout>
  );
}
