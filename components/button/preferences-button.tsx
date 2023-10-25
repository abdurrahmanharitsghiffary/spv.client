import React from "react";
import IconButton from "./icon-button";
import { FiSettings } from "react-icons/fi";
import { ButtonProps } from "@nextui-org/button";
import Link from "next/link";

export default function PreferencesButton({ as, ...props }: ButtonProps) {
  return (
    <IconButton {...props} as={Link} href="/preferences">
      <FiSettings />
    </IconButton>
  );
}
