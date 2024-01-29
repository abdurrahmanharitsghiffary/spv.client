"use client";
import React from "react";
import { cn } from "@nextui-org/system";
import { InputProps } from "@nextui-org/input";
import { InputWithControl } from "./input-with-control";
import { FieldValues, UseControllerProps } from "react-hook-form";

export default function InputUsername<T extends FieldValues>(
  props: UseControllerProps<T> & InputProps
) {
  const style = cn("max-w-md w-full", props.className);

  return (
    <InputWithControl
      type="text"
      label="Username"
      placeholder="Enter your username"
      className={style}
      {...props}
      name={props.name ?? "username"}
    />
  );
}
