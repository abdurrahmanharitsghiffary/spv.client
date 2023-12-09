"use client";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import UserCard from "../user/user-card";
import {
  useGetChatRoomParticipant,
  useGetParticipantsByRoomId,
} from "@/lib/api/chats/query";
import UserCardSkeleton from "../user/user-card-skeleton";
import { useSession } from "@/stores/auth-store";

export default function GroupMembers({ groupId }: { groupId: number }) {
  const { participants, isLoading, isSuccess } =
    useGetParticipantsByRoomId(groupId);
  const session = useSession();
  const {
    participant,
    isLoading: isPLoad,
    isSuccess: isPSuccess,
    isError: isPErr,
  } = useGetChatRoomParticipant(groupId, session?.id ?? -1);

  const role = participant?.data.role ?? "user";

  return (
    <div className="flex flex-col gap-4">
      <TypographyH4 className="px-4 !text-[1.125rem]">
        Members ({participants?.pagination?.total_records ?? 0})
      </TypographyH4>
      {isLoading || isPLoad
        ? [1, 2, 3].map((id) => (
            <UserCardSkeleton
              key={id}
              className="shadow-none rounded-none px-0"
            />
          ))
        : isSuccess &&
          isPSuccess &&
          (participants?.data ?? []).map((user) => (
            <UserCard
              user={user}
              key={user.id}
              withFollowButton={false}
              className="shadow-none rounded-none px-0"
            />
          ))}
    </div>
  );
}
