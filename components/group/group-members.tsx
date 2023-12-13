"use client";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import UserCard from "../user/user-card";
import { useGetParticipantsByRoomId } from "@/lib/api/chats/query";
import UserCardSkeleton from "../user/user-card-skeleton";
import { ChatRoomParticipant } from "@/types/chat";
import ParticipantMenuTrigger from "../menu/participant-menu/trigger";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import ChatParticipant from "../chat/chat-participant";

export default function GroupMembers({ groupId }: { groupId: number }) {
  const { participants, isLoading, isSuccess } =
    useGetParticipantsByRoomId(groupId);

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
    </div>
  );
}
