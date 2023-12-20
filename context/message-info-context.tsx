"use client";

import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useContext } from "react";

const MessageInfoContext = createContext<Disclosure>({} as Disclosure);

export default function MessageInfoProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const disclosure = useDisclosure();

  return (
    <MessageInfoContext.Provider value={disclosure}>
      {children}
    </MessageInfoContext.Provider>
  );
}

export const useMessageInfoDisclosure = () => {
  const disclosure = useContext(MessageInfoContext);

  if (!disclosure)
    throw new Error("Can't use message info disclosure outside chat page");
  return disclosure;
};
