"use client";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { useRouter } from "next/navigation";
import React from "react";
import { BiChevronLeft } from "react-icons/bi";

export default function BackFab() {
  const router = useRouter();

  return (
    <Tooltip content="Back">
      <Button
        color="primary"
        isIconOnly
        className=" rounded-l-none fixed z-30 left-0 bottom-20"
        onClick={() => router.back()}
      >
        <BiChevronLeft size={25} />
      </Button>
    </Tooltip>
  );
}
