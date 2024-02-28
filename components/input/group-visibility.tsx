"use client";
import { Select, SelectItem, SelectProps } from "@nextui-org/select";
import React from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { IoEarthSharp, IoLockClosed } from "react-icons/io5";

export default function GroupVisibility<T extends FieldValues>(
  props: UseControllerProps<T>
) {
  const {
    field: { name, onBlur, onChange, ref, value, disabled },
    formState: { errors, defaultValues },
  } = useController(props);

  return (
    <Select
      name={name}
      onBlur={onBlur}
      ref={ref}
      disabled={disabled}
      defaultSelectedKeys={[defaultValues?.[name] ?? "public"]}
      size="sm"
      description="Decides who can see all of the group contents."
      isInvalid={errors[name]?.message !== undefined}
      errorMessage={errors[name]?.message?.toString()}
      color={errors[name]?.message !== undefined ? "danger" : "default"}
      label="Group visibility"
      onChange={onChange}
      value={value}
      selectedKeys={value && [value]}
      startContent={
        value === "private" ? (
          <IoLockClosed />
        ) : (
          value === "public" && <IoEarthSharp />
        )
      }
    >
      <SelectItem
        key="public"
        description="Visible to all users."
        startContent={<IoEarthSharp />}
      >
        Public
      </SelectItem>
      <SelectItem
        startContent={<IoLockClosed />}
        key="private"
        description="Visible only to group members."
      >
        Private
      </SelectItem>
    </Select>
  );
}
