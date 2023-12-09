"use client";
import React from "react";
import { Select, SelectItem, SelectProps } from "@nextui-org/select";
import { BsGenderFemale, BsGenderMale, BsQuestion } from "react-icons/bs";
import { Gender } from "@/types";

export default function GenderSelect({
  message,
  value,
  variant,
  onChange,
}: {
  message?: string;
  value: Gender;
  variant?: SelectProps["variant"];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
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
