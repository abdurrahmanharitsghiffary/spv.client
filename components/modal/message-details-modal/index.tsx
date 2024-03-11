"use client";

import React from "react";
import ModalLayoutV2 from "../layoutV2";
import { useMessageInfoDisclosure } from "@/context/message-info-context";
import { useMessageMenuId } from "@/stores/message-menu-store";
import { useGetMessage } from "@/lib/api/messages/query";
import { TypographyH3 } from "@/components/ui/typography";
import ChatBubble from "@/components/chat/chat-bubble";
import { useSession } from "@/stores/auth-store";
import { RiErrorWarningFill } from "react-icons/ri";
import ListboxUsersRead from "@/components/user/listbox-users-read";
import UserListboxLoading from "@/components/loading/user-listbox-loading";
import { Skeleton } from "@nextui-org/react";

export default function MessageDetailsModal() {
  const { isOpen, onClose } = useMessageInfoDisclosure();
  const messageId = useMessageMenuId();
  const { message, isLoading, isError, error, isSuccess } =
    useGetMessage(messageId);
  const session = useSession();
  const isRecipient = session?.id !== message?.data?.author?.id;
  const readedBy = message?.data?.readedBy ?? [];

  const isForbidden = isError && (error as any)?.statusCode === 403;

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      wrapperClassNames={{
        body: "w-full max-w-sm mx-auto hide-scrollbar px-4 pt-4",
      }}
    >
      {isForbidden && (
        <div className="absolute inset-0 flex justify-center items-center flex-col gap-2 max-w-sm left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
          <RiErrorWarningFill className="text-danger" size={30} />
          <TypographyH3 className="!text-base !font-normal">
            Can&apos;t see message information, because you are not member of
            the group
          </TypographyH3>
        </div>
      )}
      {isLoading ? (
        <>
          <Skeleton className="h-4 w-[25%] rounded-full" />
          <UserListboxLoading />
        </>
      ) : (
        isSuccess && (
          <>
            <ChatBubble
              chat={message?.data}
              isRecipient={isRecipient}
              isDisableMenu
            />
            <TypographyH3 className="!text-base px-2">
              Read by ({readedBy?.length})
            </TypographyH3>
            <ListboxUsersRead users={readedBy} />
          </>
        )
      )}
    </ModalLayoutV2>
  );
}
