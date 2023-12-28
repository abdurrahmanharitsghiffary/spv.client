"use client";

import { NextUIProvider as NUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navigate = (path: string) => router.push(path, { scroll: false });

  return <NUIProvider navigate={navigate}>{children}</NUIProvider>;
}
