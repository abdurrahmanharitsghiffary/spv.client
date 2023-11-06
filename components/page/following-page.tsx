"use client";
import { useGetUserFollowedUsers } from "@/lib/api/users/query";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import UsersGridLayout from "../layout/users-grid-layout";
import { TypographyH3 } from "../ui/typography";
import UserCard from "../user/user-card";
import UserCardSkeleton from "../user/user-card-skeleton";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";

export default function FollowingPage() {
  const params = useParams();
  const { userFollowedUsersData, isSuccess, isLoading, isError, error } =
    useGetUserFollowedUsers(Number(params.userId));

  useNotFoundRedirect(error, isError);

  const total = useMemo(
    () => userFollowedUsersData?.data?.total ?? 0,
    [userFollowedUsersData]
  );
  return (
    <UsersGridLayout className="pt-8 px-2 pb-16">
      <TypographyH3 className="px-3 !text-base">
        {total} {total < 2 ? " followed user" : " followed users"}
      </TypographyH3>
      {isLoading
        ? [1, 2, 3, 4, 5].map((item) => (
            <UserCardSkeleton key={item} className="rounded-none shadow-none" />
          ))
        : isSuccess &&
          userFollowedUsersData?.data?.followedUsers?.map((user) => (
            <UserCard
              key={user?.id}
              user={user}
              className="rounded-none shadow-none"
            />
          ))}
    </UsersGridLayout>
  );
}
