"use client";
import clsx from "clsx";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { TypographyMuted, TypographyP } from "../ui/typography";
import Timestamp from "../timestamp";
import Gallery from "../image/gallery";
import { Chat } from "@/types/chat";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import { useMessageMenuActions } from "@/stores/message-menu-store";

const ChatBubble = forwardRef<
  HTMLDivElement,
  {
    isRecipient?: boolean;
    chat: Chat | undefined;
    isDisableMenu?: boolean;
  }
>(({ chat, isRecipient, isDisableMenu = false }, ref) => {
  const images = chat?.attachments ?? [];
  const [isHolded, setIsHolded] = useState(false);
  const holdTimeRef = useRef<NodeJS.Timeout | null>(null);
  const { onOpen } = useMessageMenuActions();

  const resetHold = () => {
    if (holdTimeRef.current) clearTimeout(holdTimeRef.current);
    setIsHolded(false);
  };

  const handleMouseDown = () => {
    resetHold();
    holdTimeRef.current = setTimeout(() => {
      setIsHolded(true);
    }, 1000);
  };

  const handleMouseUp = () => {
    resetHold();
  };

  useEffect(() => {
    if (isHolded && !isDisableMenu) {
      resetHold();
      onOpen(chat?.id ?? -1);
    }
  }, [isHolded, chat?.id, isDisableMenu]);

  return (
    <div
      ref={ref}
      className="flex w-full gap-4"
      style={{ flexDirection: !isRecipient ? "row-reverse" : "row" }}
    >
      {chat?.isGroupChat && (
        <div className="aspect-square min-w-[24px] min-h-[24px] max-w-fit max-h-fit">
          <Badge
            isInvisible={!chat?.author?.isOnline}
            color="success"
            size="sm"
            className="w-3 h-3 aspect-square"
            placement="bottom-right"
          >
            <Avatar
              size="sm"
              src={chat?.author.avatarImage?.src ?? ""}
              className=""
            />
          </Badge>
        </div>
      )}
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={clsx(
          isRecipient
            ? "self-start before:content-[''] before:bg-default-200 before:p-2 before:top-0 before:absolute before:-left-1 before:skew-x-[30deg] before:rounded-tl-md"
            : "self-end after:content-[''] after:bg-default-100 after:p-2 after:pl-4 after:top-0 after:absolute after:-right-1 after:skew-x-[-30deg] after:rounded-tr-md",
          "flex flex-col gap-1 relative",
          chat?.isGroupChat ? "max-w-[85%]" : "max-w-full",
          "active:brightness-75"
        )}
      >
        <div
          className={clsx(
            "p-2 px-4 flex flex-col gap-2 max-w-full",
            isRecipient
              ? "bg-default-200 rounded-r-medium rounded-bl-medium self-start"
              : "bg-default-100 rounded-l-medium rounded-br-medium self-end",
            images.length > 0 ? "pb-4" : ""
          )}
        >
          {chat?.isGroupChat && (
            <TypographyMuted className="!text-xs truncate break-words">
              {chat.author.fullName}
            </TypographyMuted>
          )}
          <TypographyP className="!text-[1rem] !mt-0 break-words">
            {chat?.message}
          </TypographyP>
          {images && images.length > 0 ? (
            <Gallery className="max-w-[270px]" images={images as any} />
          ) : null}
        </div>
        <Timestamp
          className={clsx(
            isRecipient ? "self-start" : "self-end",
            "!text-[0.688rem]"
          )}
          customDate={chat?.createdAt}
        />
      </div>
    </div>
  );
});

ChatBubble.displayName = "ChatBubble";

export default ChatBubble;
