"use client";
import { Button, ButtonProps } from "@nextui-org/button";
import clsx from "clsx";
import React from "react";
import { BiChevronUp } from "react-icons/bi";
import { useScrollWindowValue } from "@/hooks/use-scroll-value";

export default function FabTop({ className, radius, color }: ButtonProps) {
  const { x, y } = useScrollWindowValue();
  const cl = clsx(
    "fixed bottom-4 right-4 shadow-small shadow-secondary",
    className ?? ""
  );

  return (
    <div className={clsx("w-full", y > 200 ? "p-6 sm:p-0" : "p-0")}>
      <Button
        onClick={() => {
          if (typeof window !== "undefined") window.scroll(0, 0);
        }}
        isIconOnly
        style={{
          scale: y > 200 ? 1 : 0,
          transition: "ease-in-out .2s",
        }}
        radius={radius ?? "full"}
        color={color ?? "secondary"}
        className={cl}
      >
        <BiChevronUp size={20} />
      </Button>
    </div>
  );
}
