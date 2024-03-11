"use client";

import { RiLogoutBoxLine } from "react-icons/ri";
import { Button, ButtonProps } from "@nextui-org/button";
import { useParams } from "next/navigation";
import React from "react";
import clsx from "clsx";
import { useGroupJoin } from "@/hooks/use-group-join";

export default function JoinButton(props: ButtonProps & { groupId: number }) {
  const { onClick, isIconOnly, color, ...rest } = props;
  const { groupId } = props;
  const gId = Number(groupId);

  const { handleGroupJoin, isJoinedGroup } = useGroupJoin(gId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleGroupJoin();
  };

  return (
    <Button
      onClick={handleClick}
      isIconOnly={isJoinedGroup}
      className={clsx("w-fit font-semibold", !isJoinedGroup && "flex-1")}
      fullWidth={false}
      color={isJoinedGroup ? "danger" : "default"}
      {...rest}
    >
      {isJoinedGroup ? <RiLogoutBoxLine size={20} /> : "Join"}
    </Button>
  );
}
