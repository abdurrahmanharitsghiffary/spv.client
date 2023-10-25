"use client";
import { IGif } from "@giphy/js-types";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useState } from "react";

export const GifContext = createContext<IGif | null>(null);
export const GifModalControl = createContext<Disclosure>({} as Disclosure);
export const GifSetterContext = createContext<
  React.Dispatch<React.SetStateAction<IGif | null>>
>(() => {});

export default function ModalGifProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gif, setGif] = useState<IGif | null>(null);
  const controls = useDisclosure();

  return (
    <GifContext.Provider value={gif}>
      <GifModalControl.Provider value={controls}>
        <GifSetterContext.Provider value={setGif}>
          {children}
        </GifSetterContext.Provider>
      </GifModalControl.Provider>
    </GifContext.Provider>
  );
}
