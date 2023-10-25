"use client";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext } from "react";

export const GifMenuControlsContext = createContext<Disclosure>(
  {} as Disclosure
);

export default function GifMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useDisclosure();

  return (
    <GifMenuControlsContext.Provider value={controls}>
      {children}
    </GifMenuControlsContext.Provider>
  );
}
