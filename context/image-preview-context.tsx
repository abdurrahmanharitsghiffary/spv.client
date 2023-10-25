"use client";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/react";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export const ImagePreviewSetter = createContext<
  Dispatch<SetStateAction<string>>
>(() => {});
export const ImagePreviewSrc = createContext<string>("");
export const ImagePreviewContext = createContext<Disclosure>({} as Disclosure);

function ImagePreviewProvider({ children }: { children: React.ReactNode }) {
  const controls = useDisclosure();
  const [imageSrc, setImageSrc] = useState("");

  return (
    <ImagePreviewContext.Provider value={controls}>
      <ImagePreviewSetter.Provider value={setImageSrc}>
        <ImagePreviewSrc.Provider value={imageSrc}>
          {children}
        </ImagePreviewSrc.Provider>
      </ImagePreviewSetter.Provider>
    </ImagePreviewContext.Provider>
  );
}

export default ImagePreviewProvider;
