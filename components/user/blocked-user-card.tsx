import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { UserSimplified } from "@/types/user";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import UnblockButton from "../button/unblock-button";

export default function BlockedUserCard({
  className,
  user,
}: {
  className?: string;
  user: UserSimplified | undefined;
}) {
  const cl = clsx("w-full dark:bg-inherit", className);
  return (
    <Card className={cl}>
      <CardBody className="flex flex-col gap-4 relative p-4 max-w-full py-3">
        <div className="flex gap-4 justify-between items-center w-full">
          <Link
            className="flex gap-4 items-center w-[70%]"
            href={`/users/${user?.id}`}
          >
            <div className="w-[25%] h-fit flex justify-start items-center">
              <Avatar name={user?.username} src={user?.avatarImage?.src} />
            </div>

            <div className="flex flex-col gap-1 truncate w-[75%]">
              <TypographyLarge className="!text-base truncate">
                {user?.fullName}
              </TypographyLarge>
              <TypographyMuted className="text-xs truncate">
                {user?.username}
              </TypographyMuted>
            </div>
          </Link>
          <UnblockButton
            size="sm"
            userId={user?.id ?? -1}
            className="w-[30%] max-w-fit"
          />
        </div>
      </CardBody>
    </Card>
  );
}
