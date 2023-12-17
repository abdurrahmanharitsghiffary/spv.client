"use client";
import React from "react";
import { Input } from "@nextui-org/input";
import { cn } from "@nextui-org/system";
import { InputProps } from "@nextui-org/react";

const InputEmail = React.forwardRef<HTMLInputElement, Omit<InputProps, "ref">>(
  (props: any, ref) => {
    const style = cn("max-w-md w-full", props.className);

    return (
      <Input
        ref={ref}
        name="email"
        {...props}
        type="email"
        label="Email"
        placeholder="Enter your email"
        className={style}
      />
    );
  }
);

InputEmail.displayName = "InputEmail";

export default InputEmail;
