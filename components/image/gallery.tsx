"use client";
import React from "react";
import "./gallery.css";
import ImageWithPreview from "../image/image-with-preview";
import { useShowImageGallery } from "@/hooks/use-image-gallery";
import { useIsSSR } from "@react-aria/ssr";

const galleryStructures = [
  "'a'",
  "'a b' 'a b'",
  "'a a b' 'a a c'",
  "'a b' 'c d'",
  "'a a a b b b' 'a a a b b b' 'c c d d e e'",
  "'a a c d' 'a a b b' 'e f b b'",
  "'a a c d' 'a a f f' 'e b f f'",
];

const getArea = (index: number) => {
  // prettier-ignore
  const alphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  return alphabets[index];
};

const getTemplateArea = (items: any[]) => {
  return galleryStructures[items.length - 1];
};

export default function Gallery({
  images = [],
  className,
}: {
  images: { src: string }[];
  className?: string;
}) {
  const showGallery = useShowImageGallery();
  const isSSR = useIsSSR();
  if (images.length === 0) return null;

  return (
    <div
      className={className}
      style={{
        gridTemplateAreas:
          images.length > 7 ? galleryStructures[6] : getTemplateArea(images),
        display: "grid",
        gridAutoColumns: "1fr",
        gridAutoRows: "1fr",
        gap: 4,
      }}
    >
      {images.map((image, i) => {
        if (i > 5) return "";
        if (images.length > 6 && i === 5)
          return (
            <div
              className="relative aspect-square w-full h-full bg-center backdrop-brightness-90 dark:backdrop-brightness-110"
              style={{
                gridArea: getArea(5),
              }}
              key={image.src + i}
            >
              <div
                style={{
                  backgroundImage: `url(${image.src})`,
                  backgroundSize: "cover",
                }}
                className="absolute inset-0 brightness-75 dark:brightness-125"
              ></div>
              {!isSSR && (
                <span
                  className="absolute bg-overlay/60 inset-0 z-30 text-lg font-semibold text-white text-center justify-center items-center flex"
                  onClick={() => showGallery(images)}
                >
                  {images.slice(i + 1).length}+
                </span>
              )}
            </div>
          );
        return (
          <ImageWithPreview
            removeWrapper
            style={{
              gridArea: getArea(i),
            }}
            radius="none"
            src={image.src}
            key={image.src + i}
            alt="Pizza"
            className="aspect-square w-full h-full object-cover"
          />
        );
      })}
    </div>
  );
}
