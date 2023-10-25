"use client";

import { DisclosureContext } from "@/context/edit-profile-context";
import { useCallback, useContext } from "react";

export const useShowEditProfile = () => {
  const controls = useContext(DisclosureContext);
  return useCallback(() => {
    return controls.onOpen();
  }, []);
};

export const useEditProfileControls = () => useContext(DisclosureContext);
