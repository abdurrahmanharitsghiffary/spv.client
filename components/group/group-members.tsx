"use client";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import { useGetParticipantsByRoomId } from "@/lib/api/chats/query";
import { Skeleton } from "@nextui-org/skeleton";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";
import UserListboxLoading from "../loading/user-listbox-loading";
import MemberListbox from "./member-listbox";

export default function GroupMembers({ groupId }: { groupId: number }) {
  const {
    participants,
    isLoading,
    isSuccess,
    isFetching,
    isFetchNextNotAvailable,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetParticipantsByRoomId(groupId);

  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isFetching,
    isDisabled: isFetchNextNotAvailable,
  });

  return (
    <div className="flex flex-col">
      <TypographyH4 className="px-4 !text-base !font-normal pb-2">
        Members ({participants?.pagination?.totalRecords ?? 0})
      </TypographyH4>
      {isLoading ? (
        <UserListboxLoading />
      ) : (
        isSuccess && <MemberListbox members={participants?.data ?? []} />
      )}
      {isFetchingNextPage && <Spinner className="my-4" />}
      <div ref={ref}></div>
    </div>
  );
}
