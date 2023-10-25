import { Button } from "@nextui-org/button";
import Link from "next/link";
import React from "react";
import EditProfileTrigger from "../modal/edit-profile-modal/trigger";

export default function ProfileActionButton() {
  return (
    <div className="flex gap-4 px-4 items-center w-full">
      <EditProfileTrigger />
      <Button
        as={Link}
        href="/chats"
        className="font-semibold flex-1"
        radius="md"
      >
        Chats
      </Button>
    </div>
  );
}
