import React from "react";
import { Card, CardBody, CardProps } from "@nextui-org/card";
import { Avatar, AvatarProps } from "@nextui-org/avatar";
import clsx from "clsx";
import Link from "next/link";
import { UserSimplified } from "@/types/user";
import FollowButton from "../button/follow-button";
import { SlotsToClasses } from "@nextui-org/theme";

export default function UserCard({
  className,
  user,
  as,
  withFollowButton = true,
  classNames,
  cardClassNames,
  hideLink,
  avatarProps,
}: {
  as?: CardProps["as"];
  user: UserSimplified;
  className?: string;
  withFollowButton?: boolean;
  classNames?: { body?: string };
  cardClassNames?: SlotsToClasses<"base" | "body" | "footer" | "header">;
  hideLink?: boolean;
  avatarProps?: AvatarProps;
}) {
  const cl = clsx("w-full dark:bg-inherit", className);

  const content = (
    <>
      <Avatar
        name={user?.username}
        src={user?.avatarImage?.src}
        className="flex-shrink-0"
        {...avatarProps}
      />
      <div className="w-full flex flex-col items-start justify-center truncate mr-auto flex-auto">
        <span className="flex-1 text-small font-normal truncate max-w-full">
          {user?.fullName ?? ""}
        </span>
        <span className="w-full text-tiny text-foreground-500 max-w-full">
          {user?.username}
        </span>
      </div>
    </>
  );

  return (
    <Card classNames={cardClassNames} className={cl} as={as}>
      <CardBody
        className={clsx(
          "flex flex-col gap-4 relative p-4 max-w-full py-3",
          classNames?.body
        )}
      >
        <div className="flex gap-4 justify-between items-center w-full">
          {hideLink ? (
            <div
              className={clsx(
                "flex gap-2 items-center",
                !withFollowButton ? "w-full" : "w-[70%]"
              )}
            >
              {content}
            </div>
          ) : (
            <Link
              className={clsx(
                "flex gap-2 items-center",
                !withFollowButton ? "w-full" : "w-[70%]"
              )}
              href={`/users/${user?.id}`}
            >
              {content}
            </Link>
          )}
          {withFollowButton && (
            <FollowButton
              size="sm"
              userId={user?.id}
              className="w-[30%] max-w-fit"
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
