"use client";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext } from "react";

export const DisclosureContext = createContext<Disclosure>({} as Disclosure);

export default function EditProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useDisclosure();

  return (
    <DisclosureContext.Provider value={controls}>
      {children}
    </DisclosureContext.Provider>
  );
}
