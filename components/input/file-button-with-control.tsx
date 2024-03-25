"use client";
import { Button, ButtonProps } from "@nextui-org/button";
import React, { useCallback } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { BsImage, BsPaperclip } from "react-icons/bs";
import InputFile from "./file";
import ValidationErrorText from "../validation-error-text";
import CreatePostImageChip from "../form/create-post-image-chip";

export default function FileButtonWithControl<T extends FieldValues>(
  props: UseControllerProps<T> & ButtonProps
) {
  const {
    field: { name, onChange, ref, value, onBlur, disabled },
    formState: { errors },
  } = useController(props);

  const { children, ...rest } = props;

  const handleCloseClick = useCallback(
    (image: File) => {
      if (!value) return null;
      const files = (value as File[]).filter(
        (img) =>
          !`${img.name}${img.size}${image.type}`.includes(
            `${image.name}${image.size}${image.type}`
          )
      );
      onChange([...files]);
    },
    [value]
  );

  return (
    <div className="flex flex-col gap-2">
      <CreatePostImageChip
        images={value ?? []}
        onCloseClick={handleCloseClick}
      />
      <Button
        color="secondary"
        startContent={<BsImage />}
        className="w-fit"
        {...rest}
      >
        {children}
        <InputFile
          name={name}
          ref={ref}
          onBlur={onBlur}
          disabled={disabled}
          className="opacity-0 z-[10] absolute inset-0"
          onChange={(e) => {
            const files: File[] = [];
            Array.from(e.target?.files ?? []).forEach((img) => {
              files.push(img);
            });
            onChange(files);
          }}
          multiple={true}
        />
      </Button>

      <ValidationErrorText>
        {errors[name]?.message?.toString() ?? ""}
      </ValidationErrorText>
    </div>
  );
}
