import clsx from "clsx";
import React from "react";

export default function PostsGridLayout({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const cl = clsx("flex flex-col pt-5 w-full gap-2 pb-16", className);

  return <div className={cl}>{children}</div>;
}
