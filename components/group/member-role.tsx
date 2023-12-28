import { ChatRoomParticipant } from "@/types/chat";
import clsx from "clsx";
import React from "react";

export default function MemberRole({
  role,
}: {
  role: ChatRoomParticipant["role"];
}) {
  if (role === "user") return null;
  return (
    <span
      className={clsx(
        "text-tiny rounded-sm py-[1px] px-2 text-center capitalize",
        role === "admin" && "text-success-foreground bg-success/80",
        role === "creator" && "bg-secondary/80 text-secondary-foreground"
      )}
    >
      {role}
    </span>
  );
}
