"use client";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import UserCard from "../user/user-card";
import { useGetParticipantsByRoomId } from "@/lib/api/chats/query";
import UserCardSkeleton from "../user/user-card-skeleton";
import { ChatRoomParticipant } from "@/types/chat";
import ParticipantMenuTrigger from "../menu/participant-menu/trigger";
import { Button } from "@nextui-org/button";

export default function GroupMembers({ groupId }: { groupId: number }) {
  const { participants, isLoading, isSuccess } =
    useGetParticipantsByRoomId(groupId);

  return (
    <div className="flex flex-col gap-4">
      <TypographyH4 className="px-4 !text-[1.125rem]">
        Members ({participants?.pagination?.total_records ?? 0})
      </TypographyH4>
      {isLoading
        ? [1, 2, 3].map((id) => (
            <UserCardSkeleton
              key={id}
              className="shadow-none rounded-none px-0"
            />
          ))
        : isSuccess &&
          (participants?.data ?? []).map((user) => (
            <ParticipantCard user={user} key={user.id} />
          ))}
    </div>
  );
}

function ParticipantCard({ user }: { user: ChatRoomParticipant }) {
  return (
    <div
      className="flex gap-2 w-full justify-between items-center px-4"
      key={user.id}
    >
      <UserCard
        user={user}
        key={user.id}
        withFollowButton={false}
        className="shadow-none rounded-none px-0"
        cardClassNames={{ body: "!px-0" }}
      />
      {user.role !== "user" && (
        <Button
          color={user.role === "admin" ? "success" : "secondary"}
          variant="flat"
          size="sm"
          className="capitalize"
          disableAnimation
          disableRipple
          disabled
        >
          {user.role}
        </Button>
      )}
      <ParticipantMenuTrigger participantId={user.id} />
    </div>
  );
}
