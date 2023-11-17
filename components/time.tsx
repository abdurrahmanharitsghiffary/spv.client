"use client";
import React from "react";
import { TypographyMuted } from "./ui/typography";
import moment from "moment";

export default function Time({
  date,
  className,
}: {
  date: Date;
  className?: string;
}) {
  return (
    <TypographyMuted className={className}>
      {moment(date).calendar()}
    </TypographyMuted>
  );
}
