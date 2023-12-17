"use client";
import React from "react";
import { Select, SelectItem, SelectProps } from "@nextui-org/select";
import { BsGenderFemale, BsGenderMale, BsQuestion } from "react-icons/bs";
import { Gender } from "@/types";
import { OmitCommonProps } from "@nextui-org/system";

export default function GenderSelect<T = object>({
  message,
  value,
  variant,
  onChange,
  ...rest
}: {
  message?: string;
  value: Gender;
  variant?: SelectProps["variant"];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & OmitCommonProps<SelectProps<T>, "children">) {
  return (
    <Select
      startContent={
        value === "male" ? (
          <BsGenderMale />
        ) : value === "female" ? (
          <BsGenderFemale />
        ) : (
          <BsQuestion />
        )
      }
      variant={variant ?? "bordered"}
      color={message ? "danger" : "default"}
      isInvalid={message ? true : false}
      errorMessage={message}
      label="Gender"
      value={value ?? ""}
      selectedKeys={[value ?? "all"]}
      onChange={onChange}
      {...rest}
    >
      <SelectItem key="male" value="male" startContent={<BsGenderMale />}>
        Male
      </SelectItem>
      <SelectItem key="female" value="female" startContent={<BsGenderFemale />}>
        Female
      </SelectItem>
      <SelectItem key="not_say" value="not_say">
        Rather not say
      </SelectItem>
    </Select>
  );
}
