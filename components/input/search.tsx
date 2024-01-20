import { Input, InputProps } from "@nextui-org/input";
import clsx from "clsx";
import React from "react";
import { FiSearch } from "react-icons/fi";

export default function InputSearch({
  startContent,
  type,
  variant,
  placeholder,
  classNames,
  ...rest
}: InputProps) {
  return (
    <Input
      isClearable
      startContent={startContent ?? <FiSearch size={18} />}
      classNames={{
        inputWrapper: clsx("h-fit", classNames?.inputWrapper),
        ...classNames,
      }}
      type={type ?? "text"}
      variant={variant ?? "flat"}
      placeholder={placeholder ?? "Search..."}
      {...rest}
    />
  );
}
