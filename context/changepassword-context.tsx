"use client";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/use-disclosure";
import React, { createContext } from "react";

export const DisclosureContext = createContext<Disclosure>({} as Disclosure);

export default function ChangePasswordProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const disclosure = useDisclosure();
  return (
    <DisclosureContext.Provider value={disclosure}>
      {children}
    </DisclosureContext.Provider>
  );
}
