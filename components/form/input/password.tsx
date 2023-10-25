"use client";
import React from "react";
import { Input, InputProps } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputPassword = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "ref">
>((props: InputProps, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...props}
      ref={ref}
      label={props.label ?? "Password"}
      placeholder={props.placeholder ?? "Enter your password"}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <FaEye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      className="max-w-md w-full"
    />
  );
});

InputPassword.displayName = "InputPassword";
export default InputPassword;
