"use client";
import { Disclosure } from "@/types";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export const ImageGalleryControls = createContext<Disclosure>({} as Disclosure);
export const ImageSources = createContext<{ src: string }[]>([]);
export const ImageSourcesSetter = createContext<
  Dispatch<
    SetStateAction<
      {
        src: string;
      }[]
    >
  >
>(() => {});

function ImageGalleryProvider({ children }: { children: React.ReactNode }) {
  const [imageSources, setImageSources] = useState<{ src: string }[]>([]);
  const controls = useDisclosure();
  return (
    <ImageGalleryControls.Provider value={controls}>
      <ImageSources.Provider value={imageSources}>
        <ImageSourcesSetter.Provider value={setImageSources}>
          {children}
        </ImageSourcesSetter.Provider>
      </ImageSources.Provider>
    </ImageGalleryControls.Provider>
  );
}

export default ImageGalleryProvider;

// const [isOpen, setIsOpen] = useState<boolean>(false);

// const onClose = () => setIsOpen(false);
// const onOpen = () => setIsOpen(true);

// const controls = useMemo(() => ({ onClose, onOpen, isOpen }), [isOpen]);
