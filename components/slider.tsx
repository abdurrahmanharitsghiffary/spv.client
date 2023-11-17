import clsx from "clsx";
import React from "react";

export default function Slider({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: {
    wrapper?: string;
    body?: string;
  };
}) {
  return (
    <div
      className={clsx(
        "overflow-x-auto hide-scrollbar w-full",
        classNames?.wrapper
      )}
    >
      <div className={clsx("flex gap-4 items-start w-fit", classNames?.body)}>
        {children}
      </div>
    </div>
  );
}
