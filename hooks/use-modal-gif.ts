"use client";
import {
  GifContext,
  GifModalControl,
  GifSetterContext,
} from "@/context/modal-gif-context";
import { useCallback, useContext } from "react";
import { IGif } from "@giphy/js-types";

export const useShowModalGif = () => {
  const gifControls = useContext(GifModalControl);
  const gifSetter = useContext(GifSetterContext);

  const onOpen = useCallback((gif: IGif) => {
    gifSetter(gif);
    gifControls.onOpen();
  }, []);

  return onOpen;
};

export const useGifModalControls = () => useContext(GifModalControl);

export const useGetGif = () => useContext(GifContext);
