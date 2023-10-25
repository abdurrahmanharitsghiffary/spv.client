"use client";
import { useShowEditProfile } from "@/hooks/useEditProfile";
import { Button } from "@nextui-org/button";
import React from "react";

export default function EditProfileTrigger() {
  const onOpen = useShowEditProfile();

  return (
    <Button radius="md" className="font-semibold flex-1" onClick={onOpen}>
      Edit profile
    </Button>
  );
}
