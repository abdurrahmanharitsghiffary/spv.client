import { Divider } from "@nextui-org/divider";
import clsx from "clsx";
import React from "react";

export default function TextDivider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("w-full flex justify-evenly items-center", className)}>
      <Divider className="flex-1" />
      <p className="w-fit px-2">{children}</p>
      <Divider className="flex-1" />
    </div>
  );
}

{
  /* <div className="w-full text-center mx-auto before:w-full before:bg-divider before:p-[1px] before:rounded-md before:content-[''] before:inset-x-0 relative before:mx-auto before:absolute before:top-1/2 before:-translate-y-1/2">
  <p className="bg-background relative mx-auto px-2 w-fit">or</p>
</div>; */
}
