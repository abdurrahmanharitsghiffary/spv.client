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
import { Listbox } from "@nextui-org/listbox";
import ListboxUser from "@/components/user/listbox-user";
import ListboxUsers from "@/components/user/listbox-user";

export default function MessageDetailsModal() {
  const { isOpen, onClose } = useMessageInfoDisclosure();
  const messageId = useMessageMenuId();
  const { message, isLoading, isError, error, isSuccess } =
    useGetMessage(messageId);
  const session = useSession();
  const isRecipient = session?.id !== message?.data?.author?.id;
  const readedBy = [
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date(Date.now()),
      username: "Jukiodas",
      avatarImage: null,
    },
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date(Date.now()),
      username: "Jukiodas",
      avatarImage: null,
    },
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date(Date.now()),
      username: "Jukiodas",
      avatarImage: null,
    },
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date(Date.now()),
      username: "Jukiodas",
      avatarImage: null,
    },
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date(Date.now()),
      username: "Jukiodas",
      avatarImage: null,
    },
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date(Date.now()),
      username: "Jukiodas",
      avatarImage: null,
    },
    {
      firstName: "Lulu",
      fullName: "Lulu Lala",
      lastName: "Lala",
      isOnline: true,
      id: 999,
      readedAt: new Date("2014"),
      username: "Jukiodas",
      avatarImage: null,
    },
  ];
  console.log(isLoading);
  console.log(message, "Message");

  const isForbidden = isError && (error as any)?.statusCode === 403;

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      wrapperClassNames={{
        body: "w-full max-w-sm mx-auto hide-scrollbar px-4",
      }}
    >
      {isForbidden ? (
        <div className="absolute inset-0 flex justify-center items-center flex-col gap-2 max-w-sm left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
          <RiErrorWarningFill className="text-danger" size={30} />
          <TypographyH3 className="!text-lg">
            Can&apos;t see message information, because you are not member of
            the group
          </TypographyH3>
        </div>
      ) : (
        isSuccess && (
          <>
            <ChatBubble
              chat={message?.data}
              isRecipient={isRecipient}
              isDisableMenu
            />
            <TypographyH3 className="!text-lg px-2">
              Read by ({readedBy?.length})
            </TypographyH3>
            <ListboxUsers users={readedBy} />
          </>
        )
      )}
    </ModalLayoutV2>
  );
}
// isLoading
//               ? [1, 2, 3].map((it) => (
//                   <UserCardSkeleton
//                     key={it}
//                     as="li"
//                     className="shadow-none rounded-none p-0"
//                   />
//                 ))
//               :
