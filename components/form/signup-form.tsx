"use client";
import React from "react";
import InputPassword from "./input/password";
import FormLayout from "./layout";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputUsername from "./input/username";
import InputEmail from "./input/email";
import NextLink from "next/link";
import { Input } from "@nextui-org/input";
import { useRegister } from "@/lib/api/auth";
import { toast } from "react-toastify";
import {
  SignUpValidationSchema,
  signUpValidationSchema,
} from "@/lib/zod-schema/auth";

export default function SignUpForm() {
  const { register: registerAccount, registerAsync } = useRegister();
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<SignUpValidationSchema>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      gender: "not_say",
    },
  });

  const onSubmit: SubmitHandler<SignUpValidationSchema> = async (data) => {
    const { gender, ...rest } = data;
    const transformedData = {
      ...rest,
      gender: gender === "not_say" ? null : gender,
    };

    await toast.promise(registerAsync(transformedData), {
      error: {
        render({ data }) {
          return (
            (data as any)?.message ??
            (data as any)?.message ??
            "Something went wrong!"
          );
        },
      },
      pending: "Registering account....",
      success: {
        render(props) {
          return "Account successfully registered";
        },
      },
    });
  };

  return (
    <FormLayout
      onSubmit={handleSubmit(onSubmit)}
      title="Sign Up"
      footer={
        <div className="flex w-full flex-col gap-2">
          <Button type="submit" size="md" radius="sm" color="primary">
            Sign Up
          </Button>
          <div className="flex text-[0.875rem] gap-1">
            <p> Already have account? </p>
            <Link href="/login" size="sm" as={NextLink}>
              Login
            </Link>
          </div>
        </div>
      }
    >
      <Input
        type="text"
        label="First name"
        variant="bordered"
        className="w-full max-w-md"
        {...register("firstName")}
        placeholder="Enter your first name"
      />
      <Input
        type="text"
        variant="bordered"
        className="w-full max-w-md"
        {...register("lastName")}
        label="Last name"
        placeholder="Enter your last name"
      />
      <InputUsername
        variant="bordered"
        color={errors.username?.message ? "danger" : "default"}
        isInvalid={errors.username?.message ? true : false}
        errorMessage={errors.username?.message}
        {...register("username")}
      />
      <InputEmail
        variant="bordered"
        color={errors.email?.message ? "danger" : "default"}
        isInvalid={errors.email?.message ? true : false}
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <Select
            variant="bordered"
            color={errors.gender?.message ? "danger" : "default"}
            isInvalid={errors?.gender?.message ? true : false}
            errorMessage={errors.gender?.message}
            label="Gender"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <SelectItem key="male" value="male">
              Male
            </SelectItem>
            <SelectItem key="female" value="female">
              Female
            </SelectItem>
            <SelectItem key="not_say" value="not_say">
              Rather not say
            </SelectItem>
          </Select>
        )}
      />
      <InputPassword
        variant="bordered"
        color={errors.password?.message ? "danger" : "default"}
        isInvalid={errors.password?.message ? true : false}
        errorMessage={errors.password?.message}
        {...register("password")}
      />
    </FormLayout>
  );
}
