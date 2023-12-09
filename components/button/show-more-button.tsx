"use client";

import { Link, LinkProps } from "@nextui-org/link";
import clsx from "clsx";
import React from "react";

export default function ShowMoreButton({
  isShowMore,
  ...rest
}: { isShowMore: boolean } & LinkProps) {
  const { as, color, size, underline, className, ...anotherRest } = rest;

  return (
    <Link
      as={as ?? "button"}
      color={color ?? "foreground"}
      className={clsx("text-xs pt-2", className)}
      size={size ?? "sm"}
      underline={underline ?? "hover"}
      {...anotherRest}
    >
      {isShowMore ? "Show less" : "Show more"}
    </Link>
  );
}
