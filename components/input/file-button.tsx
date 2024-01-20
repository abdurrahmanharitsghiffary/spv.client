"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
} from "react";
import { GoPaperclip } from "react-icons/go";
import InputFile from "./file";
import clsx from "clsx";
import { MimeType } from "@/types/mime";

const FileButton = forwardRef(
  (
    {
      color,
      variant,
      onChange,
      btnClassName,
      inputClassName,
      radius,
      isIconOnly,
      multiple,
      btnProps = {},
      inputProps = {},
      acceptedFiles,
    }: {
      variant?: ButtonProps["variant"];
      color?: ButtonProps["color"];
      btnClassName?: string;
      inputClassName?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      radius?: ButtonProps["radius"];
      isIconOnly?: ButtonProps["isIconOnly"];
      multiple?: boolean;
      btnProps?: ButtonProps;
      inputProps?: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      acceptedFiles: MimeType[];
    },
    ref?: React.Ref<HTMLInputElement>
  ) => {
    const {
      variant: _,
      color: _1,
      radius: _2,
      isIconOnly: _3,
      ...rest
    } = btnProps;
    const {
      multiple: _6,
      className: _5,
      onChange: _4,
      ...restInput
    } = inputProps;

    return (
      <Button
        {...rest}
        className={clsx("relative", btnClassName)}
        radius={radius ?? "md"}
        isIconOnly={isIconOnly ?? true}
        color={color}
        variant={variant}
      >
        <GoPaperclip size={18} />
        <InputFile
          {...restInput}
          ref={ref}
          accept={acceptedFiles.join(",")}
          multiple={multiple}
          className={inputClassName}
          onChange={onChange}
        />
      </Button>
    );
  }
);

FileButton.displayName = "FileButton";

export default FileButton;
