"use client";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useState } from "react";

export const DisclosureContext = createContext<Disclosure>({} as Disclosure);
export const PostIdContext = createContext<number>(-1);
export const SetSelectedPostId = createContext<
  React.Dispatch<React.SetStateAction<number>>
>(() => {});

export default function EditPostProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const disclosure = useDisclosure();
  const [selectedPostId, setSelectedPostId] = useState(-1);
  return (
    <DisclosureContext.Provider value={disclosure}>
      <PostIdContext.Provider value={selectedPostId}>
        <SetSelectedPostId.Provider value={setSelectedPostId}>
          {children}
        </SetSelectedPostId.Provider>
      </PostIdContext.Provider>
    </DisclosureContext.Provider>
  );
}
