"use client";
import { useGetUserFollowers } from "@/lib/api/users/query";
import { useParams } from "next/navigation";
import React from "react";
import { TypographyH3 } from "../ui/typography";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import UserListboxLoading from "../loading/user-listbox-loading";
import ListboxUsers from "../user/listbox-users";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";

export default function FollowersPage() {
  const params = useParams();
  const {
    resp,
    isSuccess,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    isFetchNextNotAvailable,
    isFetching,
  } = useGetUserFollowers(Number(params.userId));
  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
  });
  useNotFoundRedirect(error, isError);

  const total = resp?.pagination?.totalRecords ?? 0;
  const users = resp?.data ?? [];
  return (
    <div className="flex flex-col gap-2 w-full max-w-md pt-6">
      <TypographyH3 className="px-3 !text-base">
        {total} {total < 2 ? " follower" : " followers"}
      </TypographyH3>
      {isLoading ? (
        <UserListboxLoading />
      ) : (
        isSuccess && (
          <ListboxUsers emptyContent="No user following." users={users} />
        )
      )}
      <div id="next_fllw_ftchr" ref={ref}></div>
      {isFetchingNextPage && <Spinner className="mx-auto my-4" />}
    </div>
  );
}
