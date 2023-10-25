import { DisclosureContext } from "@/context/changepassword-context";
import { useContext } from "react";

export const useShowChangePasswordModal = () =>
  useContext(DisclosureContext).onOpen;

export const useShowChangePasswordModalControls = () =>
  useContext(DisclosureContext);
