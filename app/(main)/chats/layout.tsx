import ChatLayout from "@/components/layout/chat-layout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat page.",
};

export default function Layout({
  children,
  room,
}: {
  children: React.ReactNode;
  room: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <ChatLayout chatPage={room} chatsPage={children} />
    </div>
  );
}
