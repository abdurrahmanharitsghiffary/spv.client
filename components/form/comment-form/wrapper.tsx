import { Card, CardProps } from "@nextui-org/card";
import clsx from "clsx";
import React from "react";

export default function CommentFormWrapper({
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Card className={clsx("shadow-none rounded-none", className)} {...rest}>
      {children}
    </Card>
  );
}
