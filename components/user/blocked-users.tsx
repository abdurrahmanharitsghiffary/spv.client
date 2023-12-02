"use client";

import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useGetBlockedUsers } from "@/lib/api/users/query";
import React from "react";
import UserCard from "./user-card";
import { Spinner } from "@nextui-org/react";
import UserCardSkeleton from "./user-card-skeleton";
import BlockedUserCard from "./blocked-user-card";
import { TypographyH4 } from "../ui/typography";

export default function BlockedUsers() {
  const {
    data,
    isLoading,
    isSuccess,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    blockedUsers,
  } = useGetBlockedUsers();
  const isDisabled =
    !isSuccess || (data?.pageParams ?? []).some((params) => params === null);
  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isDisabled,
    isFetching,
  });
  return (
    <>
      {isLoading ? (
        [1, 2, 3].map((item) => (
          <UserCardSkeleton className="rounded-none shadow-none" key={item} />
        ))
      ) : isSuccess && (blockedUsers?.data ?? []).length > 0 ? (
        blockedUsers?.data
          ?.map((user) => ({ ...user, avatarImage: user.profile?.avatarImage }))
          .map((user) => (
            <BlockedUserCard
              user={user}
              key={user?.id}
              className="rounded-none shadow-none"
            />
          ))
      ) : (
        <TypographyH4>No blocked user</TypographyH4>
      )}
      {isFetchingNextPage && <Spinner className="my-4" />}
      <div className="w-full" ref={ref}></div>
    </>
  );
}
