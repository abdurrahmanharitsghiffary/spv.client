"use client";
import React from "react";
import ModalLayout from "../layout";
import ImageWithPreview from "@/components/image/image-with-preview";
import {
  useGetGalleryImages,
  useImageGalleryControls,
} from "@/hooks/use-image-gallery";

export default function ImageGallery() {
  const { onClose, isOpen } = useImageGalleryControls();
  const images = useGetGalleryImages();

  return (
    <ModalLayout
      id="image-gallery"
      onClose={onClose}
      isOpen={isOpen}
      placement="center"
      size="full"
      classNames={{
        wrapper: "mt-0 pb-4",
      }}
      scrollBehavior="outside"
      header=""
    >
      <div className="flex flex-col gap-4">
        {images.map((image) => (
          <ImageWithPreview
            width="100%"
            height="100%"
            radius="none"
            src={image.src}
            key={image.src}
            className="max-w-sm md:max-w-xl mx-auto"
          />
        ))}
      </div>
    </ModalLayout>
  );
}
