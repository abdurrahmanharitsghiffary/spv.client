"use client";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import { useGetParticipantsByRoomId } from "@/lib/api/chats/query";
import UserCardSkeleton from "../user/user-card-skeleton";
import { Skeleton } from "@nextui-org/skeleton";
import ChatParticipant from "../chat/chat-participant";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";

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
      {isLoading ? (
        <Skeleton className="h-[12px] rounded-full mx-4 w-[90px]" />
      ) : (
        <TypographyH4 className="px-4 !text-[1.125rem]">
          Members ({participants?.pagination?.total_records ?? 0})
        </TypographyH4>
      )}
      {isLoading
        ? [1, 2, 3].map((id) => (
            <UserCardSkeleton
              key={id}
              className="shadow-none rounded-none px-0"
            />
          ))
        : isSuccess &&
          (participants?.data ?? []).map((user) => (
            <ChatParticipant participant={user} key={user.id} />
          ))}
      {isFetchingNextPage && <Spinner className="my-4" />}
      <div ref={ref}></div>
    </div>
  );
}
