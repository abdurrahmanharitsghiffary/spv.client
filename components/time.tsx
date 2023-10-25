"use client";
import React from "react";
import { TypographyMuted } from "./ui/typography";
import moment from "moment";

export default function Time({ date }: { date: Date }) {
  return <TypographyMuted>{moment(date).calendar()}</TypographyMuted>;
}
