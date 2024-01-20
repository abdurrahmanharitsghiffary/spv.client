import FabTop from "@/components/fab-top";
import React from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full pt-11 md:pt-4 max-w-lg">{children}</div>
      <FabTop className="bottom-16 md:bottom-4 z-[101]" />
    </>
  );
}
