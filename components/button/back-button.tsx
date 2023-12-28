import { ButtonProps } from "@nextui-org/button";
import React from "react";
import { BiChevronLeft } from "react-icons/bi";
import IconButton from "./icon-button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function BackButton({
  router,
  push,
  ref,
  ...props
}: {
  push?: string;
  router: AppRouterInstance;
} & ButtonProps) {
  return (
    <IconButton
      {...props}
      onClick={() => {
        if (push) return router.push(push, { scroll: false });
        return router.back();
      }}
    >
      <BiChevronLeft />
    </IconButton>
  );
}
