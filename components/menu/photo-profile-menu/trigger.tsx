"use client";
import { useShowPhotoProfileMenu } from "@/stores/photo-profile-store";
import { Button } from "@nextui-org/button";
import clsx from "clsx";
import React from "react";
import { BiCamera } from "react-icons/bi";

export default function PhotoProfileMenuTrigger({
  className,
}: {
  className?: string;
}) {
  const cl = clsx(
    "dark:bg-zinc-950 ring-offset bg-default-200 ring-2 ring-default ring-offset-background",
    className
  );

  const onOpen = useShowPhotoProfileMenu();

  return (
    <Button
      isIconOnly
      radius="full"
      color="default"
      className={cl}
      onClick={onOpen}
    >
      <BiCamera size={20} />
    </Button>
  );
}
