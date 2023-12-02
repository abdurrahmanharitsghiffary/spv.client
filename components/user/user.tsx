import Link from "next/link";
import React from "react";
import Timestamp from "../timestamp";
import { User as NextUser } from "@nextui-org/user";
import { UserSimplified } from "@/types/user";

export default function User({
  isPreview,
  user,
  createdAt,
}: {
  isPreview?: boolean;
  user: UserSimplified | undefined;
  createdAt?: Date;
}) {
  if (isPreview)
    return (
      <NextUser
        className="font-semibold"
        avatarProps={{ src: user?.avatarImage?.src }}
        classNames={{ description: "text-muted-foreground" }}
        name={user?.username}
        description={
          <Timestamp className="text-xs font-normal" date={createdAt} />
        }
      />
    );

  return (
    <NextUser
      as={Link}
      href={`/users/${user?.id}`}
      avatarProps={{ src: user?.avatarImage?.src }}
      className="font-semibold"
      name={user?.username}
      classNames={{ description: "text-muted-foreground" }}
      description={
        <Timestamp className="text-xs font-normal" date={createdAt} />
      }
    />
  );
}
