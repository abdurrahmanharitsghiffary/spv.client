import { ParticipantRole as ParticipantRoleT } from "@/types/chat";
import { Chip } from "@nextui-org/chip";
import React from "react";

const color = {
  admin: "success",
  creator: "secondary",
  co_creator: "default",
} as const;

export default function ParticipantRole({ role }: { role: ParticipantRoleT }) {
  if (role === "user") return null;
  return (
    <Chip className="capitalize" size="sm" variant="flat" color={color[role]}>
      {role.replaceAll("_", "-")}
    </Chip>
  );
}
