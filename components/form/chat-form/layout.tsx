import clsx from "clsx";
import React from "react";

export default function ChatFormLayout({
  className,
  children,
  style,
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div
      className={clsx("fixed bottom-0 inset-x-0 gap-2 z-[101]", className)}
      style={{
        backgroundColor:
          "hsl(var(--nextui-content1) / var(--nextui-content1-opacity, var(--tw-bg-opacity)))",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
