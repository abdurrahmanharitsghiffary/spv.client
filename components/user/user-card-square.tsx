import { UserAccountPublic } from "@/types/user";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import clsx from "clsx";
import React from "react";
import { TypographyLarge } from "../ui/typography";
import FollowButton from "../button/follow-button";
import Link from "next/link";

export default function UserCardSquare({
  user,
  className,
}: {
  className?: string;
  user: UserAccountPublic;
}) {
  const cl = clsx("w-[130px] bg-transparent h-auto p-2", className);
  return (
    <Card className={cl} shadow="none" radius="md">
      <CardBody
        className="flex flex-col gap-1 p-0 w-full items-center truncate max-w-full"
        as={Link}
        href={`/users/${user.id}`}
      >
        <Avatar
          src={user.profile?.avatarImage?.src}
          alt={user?.username}
          className="w-full h-auto aspect-square"
        />
        <TypographyLarge className="!text-small truncate max-w-full">
          {user?.username}
        </TypographyLarge>
      </CardBody>
      <CardFooter className="py-2">
        <FollowButton size="sm" className="w-full" userId={user?.id} />
      </CardFooter>
    </Card>
  );
}
