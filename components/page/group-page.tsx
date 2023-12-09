"use client";

import React from "react";
import { TypographyH3, TypographyMuted } from "../ui/typography";
import { Button } from "@nextui-org/button";
import EditGroupTrigger from "../modal/edit-group-modal/edit-group-trigger";
import GroupDescription from "../group/group-description";
import GroupMembers from "../group/group-members";
import AvatarWithPreview from "../image/avatar-with-preview";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import Link from "next/link";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";

export default function GroupPage({ groupId }: { groupId: number }) {
  const { chatRoom, isLoading, isSuccess, error, isError } = useGetChatRoomById(
    Number(groupId)
  );

  const isGroupChat = chatRoom?.data.isGroupChat ?? false;

  useNotFoundRedirect(
    error,
    isError,
    !chatRoom?.data?.isGroupChat && isSuccess
  );

  return (
    <>
      <div className="w-32 h-32 rounded-full z-10 mx-auto">
        <AvatarWithPreview
          color="default"
          isBordered
          src={chatRoom?.data?.picture?.src}
          alt={chatRoom?.data?.title ?? "Group picture"}
          showFallback
          className="object-cover text-default-800 dark:text-default-foreground min-h-[128px] max-h-[128px] rounded-full min-w-[128px] max-w-[128px] object-center"
        />
      </div>
      <div className="w-full flex flex-col gap-2 px-4">
        <TypographyH3 className="text-center">
          {chatRoom?.data?.title}
        </TypographyH3>
        <TypographyMuted className="text-center">
          Group {chatRoom?.data?.participants?.total ?? 0} member
          {(chatRoom?.data?.participants?.total ?? 0) > 1 ? "s" : ""}
        </TypographyMuted>
        <div className="flex gap-2 justify-between w-full py-2">
          <Button
            color="primary"
            className="flex-1"
            as={Link}
            href={`/chats/${groupId}`}
          >
            Message
          </Button>
          <EditGroupTrigger className="flex-1" />
        </div>
        <GroupDescription description={chatRoom?.data?.description ?? ""} />
      </div>
      <GroupMembers groupId={Number(groupId)} />
    </>
  );
}
