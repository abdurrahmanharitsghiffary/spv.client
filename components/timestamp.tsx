"use client";

import React from "react";
import { TypographyMuted } from "./ui/typography";
import moment from "moment";

export default function Timestamp({
  date,
  className,
  customDate,
  customFormat = "LT",
}: {
  date?: Date;
  className?: string;
  customDate?: Date;
  customFormat?: string;
}) {
  const style = `text-[0.875rem] ${className}`;

  return (
    <TypographyMuted className={style}>
      {customDate
        ? moment(customDate).format(customFormat)
        : moment(date).fromNow()}
    </TypographyMuted>
  );
}
