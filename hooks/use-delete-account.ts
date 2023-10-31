"use client";
import { DisclosureContext } from "@/context/delete-account-modal-context";
import { useContext } from "react";

export const useShowDeleteAccountModal = () =>
  useContext(DisclosureContext).onOpen;
export const useShowDeleteAccountModalControls = () =>
  useContext(DisclosureContext);
