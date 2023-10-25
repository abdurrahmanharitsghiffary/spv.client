"use client";
import React from "react";
import { Input } from "@nextui-org/input";
import { cn } from "@nextui-org/system";
import { InputProps } from "@nextui-org/react";

const InputUsername = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "ref">
>((props: any, ref) => {
  const style = cn("max-w-md w-full", props.className);

  return (
    <Input
      ref={ref}
      name="username"
      {...props}
      type="text"
      label="Username"
      placeholder="Enter your username"
      className={style}
    />
  );
});

InputUsername.displayName = "InputUsername";
export default InputUsername;
