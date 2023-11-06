import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import clsx from "clsx";
import Link from "next/link";
import { UserSimplifiedV2 } from "@/types/user";
import FollowButton from "../button/follow-button";

export default function UserCard({
  className,
  user,
}: {
  user: UserSimplifiedV2;
  className?: string;
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
              <Avatar name={user?.username} src={user?.image?.src} />
            </div>

            <div className="flex flex-col gap-1 truncate w-[75%]">
              <TypographyLarge className="!text-base truncate">{`${
                user?.firstName ?? ""
              } ${user?.lastName ?? ""}`}</TypographyLarge>
              <TypographyMuted className="text-xs truncate">
                {user?.username}
              </TypographyMuted>
            </div>
          </Link>

          <FollowButton
            size="sm"
            userId={user?.id}
            className="w-[30%] max-w-fit"
          />
        </div>
      </CardBody>
    </Card>
  );
}
