import { UserAccountPublic } from "@/types/user";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import clsx from "clsx";
import React from "react";
import { TypographyLarge } from "../ui/typography";
import FollowButton from "../button/follow-button";

export default function UserCardSquare({
  user,
  className,
}: {
  className?: string;
  user: UserAccountPublic;
}) {
  const cl = clsx("w-[130px] h-auto p-2", className);
  return (
    <Card className={cl} shadow="none" radius="md">
      <CardBody className="flex flex-col gap-2 p-0 w-full items-start">
        <Avatar
          src={user.profile?.image?.src}
          alt={user?.username}
          className="rounded-medium w-full h-auto aspect-square"
        />
        <TypographyLarge className="!text-small truncate">
          {user?.username}
        </TypographyLarge>
        <FollowButton size="sm" className="w-full" userId={user?.id} />
      </CardBody>
    </Card>
  );
}
