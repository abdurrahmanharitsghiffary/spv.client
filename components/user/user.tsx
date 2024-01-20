import Link from "next/link";
import React from "react";
import Timestamp from "../timestamp";
import { User as NextUser, UserProps } from "@nextui-org/user";
import { UserSimplified } from "@/types/user";
import { AvatarProps } from "@nextui-org/avatar";

export default function User({
  isPreview,
  user,
  createdAt,
}: {
  isPreview?: boolean;
  user: UserSimplified | undefined;
  createdAt?: Date;
}) {
  const avatarProps: AvatarProps = {
    src: user?.avatarImage?.src,
    className: "flex-shrink-0",
  };
  const classNames: UserProps["classNames"] = {
    base: "truncate max-w-full",
    description: "text-foreground-500 truncate max-w-full",
    wrapper: "truncate max-w-full",
    name: "truncate max-w-full",
  };

  return (
    <NextUser
      as={isPreview ? Link : undefined}
      href={isPreview ? `/users/${user?.id}` : undefined}
      avatarProps={avatarProps}
      name={user?.username}
      classNames={classNames}
      description={
        <Timestamp className="truncate text-xs font-normal" date={createdAt} />
      }
    />
  );
}
