"use client";
import { Input, InputProps, TextAreaProps, Textarea } from "@nextui-org/input";
import React from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

export function InputWithControl<T extends FieldValues>(
  props: UseControllerProps<T> & InputProps
) {
  const {
    name: _,
    control: _1,
    defaultValue: _2,
    disabled: _3,
    rules: _4,
    shouldUnregister: _5,
    ...rest
  } = props;

  const {
    field: { name, onBlur, onChange, ref, value, disabled },
    fieldState,
    formState: { errors },
  } = useController(props);

  return (
    <Input
      isInvalid={errors[name]?.message !== undefined}
      errorMessage={errors[name]?.message?.toString()}
      color={errors[name]?.message ? "danger" : "default"}
      {...rest}
      name={name}
      onBlur={onBlur}
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export function TextareaWithControl<T extends FieldValues>(
  props: UseControllerProps<T> & TextAreaProps
) {
  const {
    name: _,
    control: _1,
    defaultValue: _2,
    disabled: _3,
    rules: _4,
    shouldUnregister: _5,
    ...rest
  } = props;

  const {
    field: { name, onBlur, onChange, ref, value, disabled },
    fieldState,
    formState: { errors },
  } = useController(props);

  return (
    <Textarea
      isInvalid={errors[name]?.message !== undefined}
      errorMessage={errors[name]?.message?.toString()}
      color={errors[name]?.message ? "danger" : "default"}
      {...rest}
      name={name}
      onBlur={onBlur}
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
