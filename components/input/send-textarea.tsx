"use client";
import React from "react";
import { TextareaWithControl } from "./input-with-control";
import { Button, ButtonProps } from "@nextui-org/button";
import { BiSend } from "react-icons/bi";
import clsx from "clsx";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { Input, TextAreaProps } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";

export default function SendTextarea<T extends FieldValues>({
  isShowSendButton,
  label,
  variant,
  color,
  autoFocus,
  placeholder = "Message",
  ButtonProps,
  shouldShowError = true,
  ...rest
}: {
  shouldShowError?: boolean;
  isShowSendButton?: boolean;
} & UseControllerProps<T> &
  TextAreaProps & { ButtonProps?: ButtonProps }) {
  const isSSR = useIsSSR();
  return (
    <div className="w-full relative flex items-center justify-start">
      {isSSR ? (
        <Input
          placeholder={placeholder}
          label={label}
          variant={variant}
          color={color}
          autoFocus={autoFocus}
        />
      ) : (
        <TextareaWithControl
          placeholder={placeholder}
          label={label}
          shouldShowError={shouldShowError}
          variant={variant}
          color={color}
          autoFocus={autoFocus}
          minRows={1}
          maxRows={4}
          classNames={{
            label: "w-0 h-0 p-0",
            inputWrapper: clsx(isShowSendButton ? "pr-[50px]" : ""),
          }}
          {...rest}
        />
      )}
      {isShowSendButton && (
        <Button
          type="submit"
          variant="light"
          radius="full"
          isIconOnly
          className="absolute top-0 right-0 z-[102]"
          color="primary"
          {...ButtonProps}
        >
          <BiSend size={18} />
        </Button>
      )}
    </div>
  );
}
