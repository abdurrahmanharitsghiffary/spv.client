"use client";
import { useGetUserFollowedUsers } from "@/lib/api/users/query";
import { useParams } from "next/navigation";
import React from "react";
import { TypographyH3 } from "../ui/typography";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import ListboxUsers from "../user/listbox-users";
import UserListboxLoading from "../loading/user-listbox-loading";
import { Spinner } from "@nextui-org/spinner";
import { Skeleton } from "@nextui-org/skeleton";
import Empty from "../empty";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";

export default function FollowingPage() {
  const params = useParams();
  const {
    resp,
    isSuccess,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
  } = useGetUserFollowedUsers(Number(params.userId));
  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
  });
  useNotFoundRedirect(error, isError);

  const total = resp?.pagination?.total_records ?? 0;
  const users = resp?.data ?? [];
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm pt-6">
      {isLoading ? (
        <>
          <Skeleton className="h-3 rounded-full w-[5rem] mx-4" />
          <UserListboxLoading />
        </>
      ) : (
        isSuccess && (
          <>
            {total > 0 && (
              <TypographyH3 className="px-3 !text-base">
                {total} {total < 2 ? " followed user" : " followed users"}
              </TypographyH3>
            )}
            <ListboxUsers
              emptyContent={<Empty>No followed user.</Empty>}
              users={users}
            />
          </>
        )
      )}
      <div id="next_fllwing_ftchr" ref={ref}></div>
      {isFetchingNextPage && <Spinner className="my-4 mx-auto" />}
    </div>
  );
}
