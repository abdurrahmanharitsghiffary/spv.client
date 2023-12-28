import React from "react";
import { TypographyP } from "./ui/typography";
import moment from "moment";
import clsx from "clsx";

export default function History({
  createdAt,
  updatedAt,
  className,
}: {
  className?: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}) {
  return (
    <div className={clsx("flex flex-col gap-1 truncate", className)}>
      <TypographyP className="!mt-0 !text-sm">
        <span className="font-semibold">Created at: </span>
        {moment(createdAt).format("LL")}
      </TypographyP>
      <TypographyP className="!mt-0 !text-sm">
        <span className="font-semibold">Last updated at: </span>
        {moment(updatedAt).format("LL")}
      </TypographyP>
    </div>
  );
}
