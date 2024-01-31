"use client";
import React, { useState } from "react";
import ModalLayout from "../layout";
import { Image } from "@nextui-org/image";
import usePreviewImage from "@/hooks/use-preview-image";
import { MdBrokenImage } from "react-icons/md";

function ImagePreview() {
  const [isError, setIsError] = useState(false);
  const { onClose: handleClose, isOpen, src } = usePreviewImage();

  const onClose = () => {
    handleClose();
    setIsError(false);
  };

  return (
    <ModalLayout
      id="image-preview"
      key={src}
      wrapperClassNames={{ wrapper: "overflow-hidden z-[202]" }}
      classNames={{
        wrapper:
          "my-0 h-auto min-h-[100dvh] bg-[rgba(0,0,0,.5)] max-h-[100dvh] h-[100dvh]",
        body: "h-full w-full max-w-full max-h-full flex justify-center items-start py-0 px-0",
        header: "hidden",
        footer: "hidden",
      }}
      hideCloseButton
      bodyOnClick={onClose}
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
