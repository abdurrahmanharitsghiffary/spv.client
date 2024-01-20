import { UserSimplified } from "@/types/user";
import { Avatar } from "@nextui-org/avatar";
import clsx from "clsx";
import React from "react";
import { TypographyH3 } from "./ui/typography";

export default function Author({
  author,
  className,
}: {
  author: UserSimplified | undefined;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <TypographyH3 className="!text-base">Author</TypographyH3>
      <div className={clsx("flex justify-start gap-2 max-w-full", className)}>
        <Avatar
          className="flex-shrink-0"
          name={author?.fullName ?? ""}
          showFallback
          src={author?.avatarImage?.src}
        />
        <div className="flex flex-col truncate">
          <p className="truncate">{author?.fullName}</p>
          <p className="text-tiny truncate text-foreground-500">
            {author?.username}
          </p>
        </div>
      </div>
    </div>
  );
}
