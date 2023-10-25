"use client";
import {
  ImageGalleryControls,
  ImageSources,
  ImageSourcesSetter,
} from "@/context/image-gallery-context";
import { useCallback, useContext } from "react";

export const useShowImageGallery = () => {
  const controls = useContext(ImageGalleryControls);
  const setImageSources = useContext(ImageSourcesSetter);

  const handleOpen = useCallback((images: { src: string }[]) => {
    setImageSources([...images]);
    controls.onOpen();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return handleOpen;
};

export const useGetGalleryImages = () => {
  const imageSources = useContext(ImageSources);

  return imageSources;
};

export const useImageGalleryControls = () => {
  const controls = useContext(ImageGalleryControls);

  return controls;
};
