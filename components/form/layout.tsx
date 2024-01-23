"use client";
import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { TypographyH3 } from "../ui/typography";
import { cn } from "@nextui-org/system";
import { SlotsToClasses } from "@nextui-org/theme";

export default function FormLayout({
  className,
  children,
  title,
  footer,
  onSubmit,
  classNames,
}: {
  className?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  title: string;
  onSubmit: any;
  classNames?: SlotsToClasses<"base" | "body" | "footer" | "header">;
}) {
  const style = cn(className, "!shadow-small w-full min-w-[320px] max-w-sm");

  return (
    <Card
      radius="none"
      isBlurred
      className={style}
      as="form"
      classNames={classNames}
      onSubmit={onSubmit}
    >
      <CardHeader className="p-5 justify-center">
        <TypographyH3>{title}</TypographyH3>
      </CardHeader>
      <CardBody className="gap-3">{children}</CardBody>
      <CardFooter className="p-5 flex justify-end">{footer}</CardFooter>
    </Card>
  );
}
