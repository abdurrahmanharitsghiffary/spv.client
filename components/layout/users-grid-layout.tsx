import clsx from "clsx";
import React from "react";

export default function UsersGridLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cl = clsx("flex flex-col w-full items-start gap-2", className);

  return <div className={cl}>{children}</div>;
}
