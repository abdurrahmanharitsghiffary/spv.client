"use client";

import { useIsSm } from "@/hooks/use-media-query";
import { useIsSSR } from "@react-aria/ssr";
import { useParams } from "next/navigation";
import React from "react";

export default function ChatLayout({
  chatPage,
  chatsPage,
}: {
  chatsPage?: React.ReactNode;
  chatPage?: React.ReactNode;
}) {
  const { chatId } = useParams();
  const isSm = useIsSm();
  const isSSR = useIsSSR();
  return (
    <>
      {chatPage}
      {isSm || !chatId || isSSR ? chatsPage : null}
    </>
  );
}
