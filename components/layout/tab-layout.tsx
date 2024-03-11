import clsx from "clsx";
import React from "react";

export default function TabLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("flex flex-col gap-4", className)}>
      {children}
    </section>
  );
}
