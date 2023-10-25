"use client";
import React from "react";
import InputPassword from "./input/password";
import FormLayout from "./layout";
import { Button, Link } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputEmail from "./input/email";
import NextLink from "next/link";
import { FcGoogle } from "react-icons/fc";
import { TypographyMuted } from "../ui/typography";
import { useLogin } from "@/lib/api/auth";
import { toast } from "react-toastify";

const loginValidationSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, {
        message: "Password is must be at least 8 characters",
      })
      .max(22, { message: "Password is must not be higher than 22 chars" }),
    confirmPassword: z.string({
      required_error: "Password confirmation is required",
    }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" }),
  })
  .refine(
    (arg) => {
      if (arg.confirmPassword !== arg.password) {
        return false;
      }
      return true;
    },
    {
      message: "Confirm password and password does not match",
      path: ["confirmPassword"],
    }
  );

type LoginValidationSchema = z.infer<typeof loginValidationSchema>;

export default function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(loginValidationSchema),
  });
  const { error, loginAsync } = useLogin();
  const errorMessage: string = (error as any)?.data?.message ?? "";

  const onSubmit: SubmitHandler<LoginValidationSchema> = (data) => {
    toast.promise(loginAsync(data), {
      error: {
        render({ data }) {
          return (data as any)?.data?.message ?? "Something went wrong!";
        },
      },
      pending: "Login to account....",
      success: {
        render(props) {
          return "Account successfully logged";
        },
      },
    });
  };

  return (
    <FormLayout
      onSubmit={handleSubmit(onSubmit)}
      title="Login"
      footer={
        <div className="flex w-full flex-col gap-2">
          {errorMessage && (
            <TypographyMuted className="text-danger !text-[12px]">
              {errorMessage}
            </TypographyMuted>
          )}
          <Link as={NextLink} size="sm" href="/resetpassword">
            Forget your password?
          </Link>
          <Button type="submit" size="md" radius="sm" color="primary">
            Login
          </Button>
          <Button
            size="md"
            color="secondary"
            type="button"
            radius="sm"
            endContent={<FcGoogle size={20} />}
          >
            Sign in with Google
          </Button>
          <div className="flex text-[14px] gap-1">
            <p>No have account? </p>
            <Link href="/signup" size="sm" as={NextLink}>
              Sign Up
            </Link>
          </div>
        </div>
      }
    >
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
      <InputPassword
        label="Confirm"
        placeholder="Enter again your password"
        color={errors.confirmPassword?.message ? "danger" : "default"}
        isInvalid={errors.confirmPassword?.message ? true : false}
        errorMessage={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
    </FormLayout>
  );
}
