import { Button, ButtonProps } from "@nextui-org/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import React from "react";
import { BiChevronLeft } from "react-icons/bi";
import IconButton from "./button/icon-button";

export default function BackButton({
  router,
  push,
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
