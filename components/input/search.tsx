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
      autoFocus={autoFocus ?? true}
      startContent={startContent ?? <FiSearch size={20} />}
      type={type ?? "search"}
      variant={variant ?? "faded"}
      placeholder={placeholder ?? "Search..."}
      {...rest}
    />
  );
}
