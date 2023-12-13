import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar, AvatarProps } from "@nextui-org/avatar";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import clsx from "clsx";
import Link from "next/link";
import { UserSimplified } from "@/types/user";
import FollowButton from "../button/follow-button";
import { SlotsToClasses } from "@nextui-org/theme";

export default function UserCard({
  className,
  user,
  withFollowButton = true,
  classNames,
  cardClassNames,
  hideLink,
  titleFontSize,
  descriptionFontSize,
  avatarProps,
}: {
  user: UserSimplified;
  className?: string;
  withFollowButton?: boolean;
  classNames?: { body?: string };
  cardClassNames?: SlotsToClasses<"base" | "body" | "footer" | "header">;
  hideLink?: boolean;
  titleFontSize?: number | string;
  descriptionFontSize?: number | string;
  avatarProps?: AvatarProps;
}) {
  const cl = clsx("w-full dark:bg-inherit", className);
  return (
    <Card classNames={cardClassNames} className={cl}>
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
                "flex gap-4 items-center",
                !withFollowButton ? "w-full" : "w-[70%]"
              )}
            >
              <Avatar
                name={user?.username}
                src={user?.avatarImage?.src}
                className="flex-shrink-0"
                {...avatarProps}
              />
              <div className="flex flex-col gap-1 truncate w-[75%]">
                <TypographyLarge className="!text-[0.875rem] truncate">
                  {user?.fullName ?? ""}
                </TypographyLarge>
                <TypographyMuted className="text-xs truncate">
                  {user?.username}
                </TypographyMuted>
              </div>
            </div>
          ) : (
            <Link
              className={clsx(
                "flex gap-4 items-center",
                !withFollowButton ? "w-full" : "w-[70%]"
              )}
              href={`/users/${user?.id}`}
            >
              <div className="h-fit flex justify-start items-center px-1">
                <Avatar
                  name={user?.username}
                  src={user?.avatarImage?.src}
                  {...avatarProps}
                />
              </div>

              <div className="flex flex-col gap-1 truncate w-[75%]">
                <TypographyLarge className="!text-base truncate">
                  {user?.fullName ?? ""}
                </TypographyLarge>
                <TypographyMuted className="text-xs truncate">
                  {user?.username}
                </TypographyMuted>
              </div>
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
