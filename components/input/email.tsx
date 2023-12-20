"use client";
import React from "react";
import { InputProps } from "@nextui-org/input";
import { cn } from "@nextui-org/system";
import { InputWithControl } from "./input-with-control";
import { FieldValues, UseControllerProps } from "react-hook-form";

export default function InputEmail<T extends FieldValues>(
  props: UseControllerProps<T> & InputProps
) {
  const style = cn("max-w-md w-full", props.className);

  return (
    <InputWithControl
      type="email"
      label="Email"
      placeholder="Enter your email"
      className={style}
      {...props}
    />
  );
}
