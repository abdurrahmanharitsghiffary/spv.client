import React from "react";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return <div className="flex flex-col pt-6 w-full max-w-sm">{children}</div>;
}
