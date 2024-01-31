"use client";

import { NextUIProvider as NUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return <NUIProvider navigate={router.push}>{children}</NUIProvider>;
}
