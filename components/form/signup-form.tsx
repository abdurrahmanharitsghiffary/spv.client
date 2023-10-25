"use client";
import React from "react";
import InputPassword from "./input/password";
import FormLayout from "./layout";
import { Button, Link } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputUsername from "./input/username";
import InputEmail from "./input/email";
import NextLink from "next/link";
import { Input } from "@nextui-org/input";
import { useRegister } from "@/lib/api/auth";
import { toast } from "react-toastify";

const signUpValidationSchema = z.object({
  lastName: z
    .string()
    .min(2, "Lastname is must at least 3 character")
    .max(125, "Lastname is must at least below 125 characters"),
  firstName: z
    .string()
    .min(2, "Firstname is must at least 3 character")
    .max(125, "Lastname is must at least below 125 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, {
      message: "Password is must be at least 8 characters",
    })
    .max(22, { message: "Password is must not be higher than 22 chars" }),
  username: z
    .string({ required_error: "Username is required" })
    .min(4, {
      message: "Username is must be at least 4 character",
    })
    .max(50, {
      message: "Username is must at least below 50 characters",
    }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),
});

type SignUpValidationSchema = z.infer<typeof signUpValidationSchema>;

export default function SignUpForm() {
  const { register: registerAccount, registerAsync } = useRegister();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpValidationSchema>({
    resolver: zodResolver(signUpValidationSchema),
  });
  const onSubmit: SubmitHandler<SignUpValidationSchema> = (data) =>
    toast.promise(registerAsync(data), {
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

  return (
    <FormLayout
      onSubmit={handleSubmit(onSubmit)}
      title="Sign Up"
      footer={
        <div className="flex w-full flex-col gap-2">
          <Button type="submit" size="md" radius="sm" color="primary">
            Sign Up
          </Button>
          <div className="flex text-[14px] gap-1">
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
        className="w-full max-w-md"
        {...register("firstName")}
        placeholder="Enter your first name"
      />
      <Input
        type="text"
        className="w-full max-w-md"
        {...register("lastName")}
        label="Last name"
        placeholder="Enter your last name"
      />
      <InputUsername
        color={errors.username?.message ? "danger" : "default"}
        isInvalid={errors.username?.message ? true : false}
        errorMessage={errors.username?.message}
        {...register("username")}
      />
      <InputEmail
        color={errors.email?.message ? "danger" : "default"}
        isInvalid={errors.email?.message ? true : false}
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <InputPassword
        color={errors.password?.message ? "danger" : "default"}
        isInvalid={errors.password?.message ? true : false}
        errorMessage={errors.password?.message}
        {...register("password")}
      />
    </FormLayout>
  );
}
