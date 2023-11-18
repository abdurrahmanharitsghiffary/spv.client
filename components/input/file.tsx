"use client";

import { ACCEPTED_IMAGE_TYPES } from "@/lib/zod-schema/image";
import { clsx } from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";

const InputFile = forwardRef(
  (
    {
      onChange,
      multiple,
      className,
      type,
      accept,
      ...rest
    }: DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ref: React.Ref<HTMLInputElement>
  ) => (
    <input
      ref={ref}
      type="file"
      multiple={multiple ?? false}
      accept={ACCEPTED_IMAGE_TYPES.join(",")}
      className={clsx("absolute inset-0 opacity-0", className)}
      onChange={onChange}
      {...rest}
    />
  )
);

InputFile.displayName = "InputFile";
export default InputFile;
