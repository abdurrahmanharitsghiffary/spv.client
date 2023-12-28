"use client";

import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useGetBlockedUsers } from "@/lib/api/users/query";
import React, { useMemo } from "react";
import { Spinner } from "@nextui-org/spinner";
import { TypographyH4 } from "../ui/typography";
import ListboxBlockedUsers from "./listbox-blocked-users";
import { getUserSimplified } from "@/lib/getUserSimplified";
import UserListboxLoading from "../loading/user-listbox-loading";
import { FaBoxOpen } from "react-icons/fa";
import { GoInbox } from "react-icons/go";

export default function BlockedUsers() {
  const {
    isLoading,
    isSuccess,
    isFetchNextNotAvailable,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    blockedUsers,
  } = useGetBlockedUsers();

  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isDisabled: isFetchNextNotAvailable,
    isFetching,
  });

  const users = useMemo(
    () => (blockedUsers?.data ?? []).map((user) => getUserSimplified(user)),
    [blockedUsers]
  );

  return (
    <>
      {isLoading ? (
        <UserListboxLoading />
      ) : (
        isSuccess && <ListboxBlockedUsers users={users} />
      )}
      {isFetchingNextPage && <Spinner className="my-4" />}
      <div className="w-full" ref={ref}></div>
    </>
  );
}
