import {
  ImagePreviewContext,
  ImagePreviewSetter,
  ImagePreviewSrc,
} from "@/context/image-preview-context";
import { useCallback, useContext } from "react";

function usePreviewImage() {
  const previewControls = useContext(ImagePreviewContext);
  const previewSrc = useContext(ImagePreviewSrc);

  return { ...previewControls, src: previewSrc };
}

export function useShowPreviewImage() {
  const previewSetter = useContext(ImagePreviewSetter);
  const previewControls = useContext(ImagePreviewContext);

  const setImage = useCallback(
    (imageSrc: string) => previewSetter(imageSrc),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleOpen = useCallback(
    (src: string) => {
      if (!src) return null;
      setImage(src);
      previewControls.onOpen();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return handleOpen;
}

export default usePreviewImage;
