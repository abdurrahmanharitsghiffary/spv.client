import { Input, InputProps } from "@nextui-org/input";
import React from "react";
import { FiSearch } from "react-icons/fi";

export default function InputSearch({
  autoFocus,
  startContent,
  type,
  variant,
  placeholder,
  ...rest
}: InputProps) {
  return (
    <Input
      isClearable
      autoFocus={autoFocus ?? true}
      startContent={startContent ?? <FiSearch size={18} />}
      type={type ?? "text"}
      variant={variant ?? "flat"}
      placeholder={placeholder ?? "Search..."}
      {...rest}
    />
  );
}
