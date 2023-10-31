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
  const cn = `${
    className ?? ""
  } flex w-full flex-col h-full items-center justify-center gap-4`;

  return (
    <section className={cn} style={style}>
      <div className="flex w-full flex-col items-center max-w-lg text-start justify-center relative">
        {children}
      </div>
    </section>
  );
}
