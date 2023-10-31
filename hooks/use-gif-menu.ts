"use client";
import { GifMenuControlsContext } from "@/context/gif-menu-context";
import { useContext } from "react";

export const useGifMenuShow = () => useContext(GifMenuControlsContext).onOpen;
export const useGifMenuClose = () => useContext(GifMenuControlsContext).onClose;
export const useGifMenuIsOpen = () => useContext(GifMenuControlsContext).isOpen;

export const useGifMenuControls = () => useContext(GifMenuControlsContext);
