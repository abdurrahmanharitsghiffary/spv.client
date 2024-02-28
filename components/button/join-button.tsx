"use client";

import { RiLogoutBoxLine } from "react-icons/ri";
import { Button, ButtonProps } from "@nextui-org/button";
import { useParams } from "next/navigation";
import React from "react";
import clsx from "clsx";
import { useGroupJoin } from "@/hooks/use-group-join";

export default function JoinButton(props: ButtonProps) {
  const { onClick, isIconOnly, color, ...rest } = props;
  const { groupId } = useParams();
  const gId = Number(groupId);

  const { handleGroupJoin, isJoinedGroup, applyType } = useGroupJoin(gId);

  return (
    <Button
      onClick={handleGroupJoin}
      isIconOnly={isJoinedGroup}
      className={clsx("w-fit", !isJoinedGroup && "flex-1")}
      fullWidth={false}
      color={isJoinedGroup ? "danger" : "default"}
      {...rest}
    >
      {isJoinedGroup ? (
        <RiLogoutBoxLine size={20} />
      ) : applyType === "private" ? (
        "Apply"
      ) : (
        "Join"
      )}
    </Button>
  );
}
