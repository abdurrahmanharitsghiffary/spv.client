"use client";
import React from "react";
import InputPassword from "../input/password";
import FormLayout from "./layout";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputUsername from "../input/username";
import InputEmail from "../input/email";
import NextLink from "next/link";
import { useRegister } from "@/lib/api/auth";
import { toast } from "react-toastify";
import {
  SignUpValidationSchema,
  signUpValidationSchema,
} from "@/lib/zod-schema/auth";
import { InputWithControl } from "../input/input-with-control";
import GenderSelect from "../gender-select";

export default function SignUpForm() {
  const { register: registerAccount, registerAsync } = useRegister();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValidationSchema>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      gender: "not_say",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      username: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpValidationSchema> = async (data) => {
    if (isSubmitting) return null;
    const { gender, ...rest } = data;
    const transformedData = {
      ...rest,
      gender: gender === "not_say" ? null : gender,
    };

    await toast.promise(registerAsync(transformedData), {
      error: {
        render({ data }) {
          return (data as any)?.message ?? "Something went wrong!";
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
      <InputWithControl
        type="text"
        label="First name"
        variant="bordered"
        className="w-full max-w-md"
        control={control}
        name="firstName"
        placeholder="Enter your first name"
      />
      <InputWithControl
        type="text"
        variant="bordered"
        className="w-full max-w-md"
        control={control}
        name="lastName"
        label="Last name"
        placeholder="Enter your last name"
      />
      <InputUsername variant="bordered" control={control} name="username" />
      <InputEmail variant="bordered" control={control} name="email" />
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <GenderSelect
            variant="bordered"
            isInvalid={errors?.gender?.message ? true : false}
            errorMessage={errors.gender?.message}
            label="Gender"
            value={value ?? "not_say"}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      />
      <InputPassword variant="bordered" control={control} name="password" />
    </FormLayout>
  );
}
