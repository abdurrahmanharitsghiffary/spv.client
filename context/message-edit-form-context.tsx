"use client";

import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useContext } from "react";

const MessageEditDisclosureContext = createContext<Disclosure>(
  {} as Disclosure
);

export default function MessageEditFormProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const disclosure = useDisclosure();
  return (
    <MessageEditDisclosureContext.Provider value={disclosure}>
      {children}
    </MessageEditDisclosureContext.Provider>
  );
}

export const useMessageEditDisclosure = () => {
  const disclosure = useContext(MessageEditDisclosureContext);
  if (!disclosure)
    throw new Error("Cannot use message edit context outside single chat page");

  return disclosure;
};
