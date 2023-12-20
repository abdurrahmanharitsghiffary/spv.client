import clsx from "clsx";
import React from "react";

export default function ChatFormBody({
  className,
  children,
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={clsx(
        "w-full flex justify-center flex-col gap-2 p-2 border-t-1 border-divider",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
