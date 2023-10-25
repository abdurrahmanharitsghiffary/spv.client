"use client";
import { useShowPreviewImage } from "@/hooks/usePreviewImage";
import clsx from "clsx";
import React from "react";

export default function CoverImage({
  src,
  className,
}: {
  className?: string;
  src: string;
}) {
  const cl = clsx("h-[180px] w-full bg-default-100", className);
  const showPreview = useShowPreviewImage();
  return (
    <div
      className={cl}
      onClick={() => showPreview(src)}
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
}
