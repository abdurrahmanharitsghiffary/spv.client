import clsx from "clsx";
import React from "react";

export default function Spacer({
  isShow,
  className,
  ...rest
}: { isShow?: boolean } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  if (!isShow) return null;

  return <div className={clsx("w-full", className)} {...rest}></div>;
}
