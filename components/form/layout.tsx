"use client";
import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { TypographyH3 } from "../ui/typography";
import { cn } from "@nextui-org/system";

export default function FormLayout({
  className,
  children,
  title,
  footer,
  onSubmit,
}: {
  className?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  title: string;
  onSubmit: any;
}) {
  const style = cn(className, "w-full min-w-[320px] max-w-sm");

  return (
    <Card isBlurred className={style} as="form" onSubmit={onSubmit}>
      <CardHeader className="p-5 justify-center">
        <TypographyH3>{title}</TypographyH3>
      </CardHeader>
      <CardBody className="gap-3">{children}</CardBody>
      <CardFooter className="p-5 flex justify-end">{footer}</CardFooter>
    </Card>
  );
}
