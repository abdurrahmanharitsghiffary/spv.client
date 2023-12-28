import ChatLayout from "@/components/layout/chat-layout";
import React from "react";

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
