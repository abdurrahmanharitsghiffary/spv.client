"use client";
import clsx from "clsx";
import { useParams } from "next/navigation";
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
  const { chatId } = useParams();
  return (
    <div
      className={clsx(
        "fixed bottom-0 inset-x-0 gap-2 z-[101]",
        chatId && "sm:left-[300px] lg:left-[400px]",
        className
      )}
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
