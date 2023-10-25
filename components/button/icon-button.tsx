import { Button, ButtonProps } from "@nextui-org/button";
import clsx from "clsx";
import React from "react";

export default function IconButton({
  children,
  className,
  ...rest
}: { children: React.ReactNode; className?: string } & ButtonProps) {
  const cl = clsx("text-[20px]", className);

  return (
    <Button isIconOnly variant="light" className={cl} radius="full" {...rest}>
      {children}
    </Button>
  );
}
