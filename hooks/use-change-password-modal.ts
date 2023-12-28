import { DisclosureContext } from "@/context/change-password-context";
import { useContext } from "react";

export const useShowChangePasswordModal = () =>
  useContext(DisclosureContext).onOpen;

export const useShowChangePasswordModalControls = () =>
  useContext(DisclosureContext);
