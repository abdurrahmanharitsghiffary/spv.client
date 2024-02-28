"use client";
import React, { useEffect, useState } from "react";
import ModalLayout from "../layout";
import { Image } from "@nextui-org/image";
import usePreviewImage from "@/hooks/use-preview-image";
import { MdBrokenImage } from "react-icons/md";

function ImagePreview() {
  const [isError, setIsError] = useState(false);
  const { onClose: handleClose, isOpen, src } = usePreviewImage();
  // const [windowHeight, setWindowHeight] = useState(0);
  const onClose = () => {
    handleClose();
    setIsError(false);
  };
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setWindowHeight(window.innerHeight ?? 0);
  //   }
  // }, []);

  // useEffect(() => {
  //   const el = document.querySelector("section.image-preview-wrapper");
  //   console.log(el, "Element");
  //   if (!el || !isOpen) return;
  //   const h = windowHeight + "px";
  //   el.setAttribute("style", `min-height: ${h};max-height: ${h};height: ${h}`);
  //   return () => {
  //     el.removeAttribute("style");
  //   };
  // }, [windowHeight, isOpen]);

  return (
    <ModalLayout
      id="image-preview"
      wrapperClassNames={{ wrapper: "overflow-hidden z-[202]" }}
      classNames={{
        wrapper:
          "my-0 h-auto bg-[rgba(0,0,0,.5)] max-h-[100dvh] min-h-[100dvh] h-[100dvh]",
        body: "h-full w-full max-w-full max-h-full flex justify-center items-start py-0 px-0",
        header: "hidden",
        footer: "hidden",
      }}
      scrollBehavior="outside"
      placement="center"
      header={""}
      size="full"
      onClose={onClose}
      isOpen={isOpen}
    >
      {!isError && (
        <Image
          radius="none"
          src={src}
          alt="Preview image"
          onError={() => setIsError(true)}
          width={150}
          height={150}
          removeWrapper
          className="max-h-full w-auto h-auto mx-auto"
        />
      )}
      {isError && <MdBrokenImage size={70} />}
    </ModalLayout>
  );
}

export default ImagePreview;
