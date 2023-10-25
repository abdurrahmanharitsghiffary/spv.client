import FabTop from "@/components/fab-top";
import React from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full pt-[42px]">{children}</div>
      <FabTop className="bottom-16 z-[101]" />
    </>
  );
}
