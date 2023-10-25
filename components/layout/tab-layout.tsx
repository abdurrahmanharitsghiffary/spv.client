import React from "react";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return <section className="pb-14 flex flex-col gap-4">{children}</section>;
}
