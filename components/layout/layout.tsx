"use client";
import clsx from "clsx";
import { useParams } from "next/navigation";
import React from "react";

export default function Layout({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | undefined;
}) {
  const { chatId } = useParams();

  const cn = clsx(
    "flex w-full flex-col h-full items-center justify-center gap-4 ",
    className
  );

  return (
    <section className={cn} style={style}>
      <div
        className={clsx(
          "flex w-full flex-col items-center text-start justify-center relative max-w-lg",
          chatId && "max-w-none"
        )}
      >
        {children}
      </div>
    </section>
  );
}
