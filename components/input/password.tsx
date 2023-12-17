"use client";
import React from "react";
import { InputProps } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputWithControl } from "./input-with-control";
import { FieldValues, UseControllerProps } from "react-hook-form";

export default function InputPassword<T extends FieldValues>(
  props: UseControllerProps<T> & InputProps
) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <InputWithControl
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
      {...props}
    />
  );
}
