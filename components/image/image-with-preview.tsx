"use client";
import { useShowPreviewImage } from "@/hooks/use-preview-image";
import { Image, ImageProps } from "@nextui-org/image";
import React, { useState } from "react";
import { MdBrokenImage } from "react-icons/md";

export default function ImageWithPreview(props: ImageProps) {
  const showPreview = useShowPreviewImage();
  const [isError, setIsError] = useState(false);

  if (isError)
    return (
      <div
        className={
          props.className +
          "backdrop-brightness-90 dark:backdrop-brightness-110 flex justify-center items-center mx-auto w-full h-full max-w-fit max-h-fit"
        }
        style={props.style}
      >
        <MdBrokenImage size={50} />
      </div>
    );

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...props}
      onError={() => setIsError(true)}
      onClick={() => showPreview(props.src ?? "")}
    />
  );
}
