"use client";
import React, { useState } from "react";
import ModalLayout from "../layout";
import { Image } from "@nextui-org/image";
import { motion } from "framer-motion";
import usePreviewImage from "@/hooks/use-preview-image";
import AnimationControl from "./animation-control";
import { MdBrokenImage } from "react-icons/md";

function ImagePreview() {
  const [animation, setAnimation] = useState({
    scale: 1,
    rotate: 0,
  });
  const [isError, setIsError] = useState(false);
  const { onClose: handleClose, isOpen, src } = usePreviewImage();

  const onClose = () => {
    setAnimation({ scale: 1, rotate: 0 });
    handleClose();
    setIsError(false);
  };

  return (
    <ModalLayout
      id="image-preview"
      key={src}
      wrapperClassNames={{ wrapper: "overflow-hidden z-[202]" }}
      classNames={{
        wrapper: "my-0 h-auto min-h-[100dvh] bg-[rgba(0,0,0,.5)]",
        footer: "right-4 absolute bottom-4 w-fit p-0",
      }}
      hideCloseButton
      bodyOnClick={onClose}
      scrollBehavior="outside"
      placement="center"
      header={""}
      size="full"
      footer={<AnimationControl setAnimation={setAnimation} src={src} />}
      onClose={onClose}
      isOpen={isOpen}
    >
      <motion.div
        animate={animation}
        style={{
          maxWidth: 576,
          width: "95%",
          height: "auto",
          maxHeight: 350,
          marginInline: "auto",
          position: "absolute",
          left: "50%",
          top: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          translate: "-50% -50%",
        }}
      >
        {!isError && (
          <Image
            // drag
            // dragConstraints={constraintRef}
            // dragElastic={0}
            // dragSnapToOrigin
            as={motion.img}
            radius="none"
            src={src}
            alt="Preview image"
            onError={() => setIsError(true)}
            width={150}
            height={150}
            removeWrapper
            // onClick={(e) => e.stopPropagation()}
            className="max-w-sm w-full h-auto md:max-w-xl mx-auto"
          />
        )}
        {isError && <MdBrokenImage size={70} />}
      </motion.div>
    </ModalLayout>
  );
}

export default ImagePreview;
