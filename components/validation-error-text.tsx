import React from "react";
import { TypographyMuted } from "./ui/typography";
import clsx from "clsx";

export default function ValidationErrorText({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <TypographyMuted className={clsx("text-danger text-tiny", className)}>
      {children}
    </TypographyMuted>
  );
}
