"use client";
import React from "react";
import InputPassword from "./input/password";
import FormLayout from "./layout";
import { Button, Link } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputEmail from "./input/email";
import NextLink from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@/lib/api/auth";
import { toast } from "react-toastify";
import {
  LoginValidationSchema,
  loginValidationSchema,
} from "@/lib/zod-schema/auth";
import ValidationErrorText from "../validation-error-text";

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
      classNames={{ footer: "pt-0" }}
      footer={
        <div className="flex w-full flex-col gap-2">
          {errorMessage && (
            <ValidationErrorText>{errorMessage}</ValidationErrorText>
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
          <div className="flex text-[0.875rem] gap-1">
            <p>No have account? </p>
            <Link href="/signup" size="sm" as={NextLink}>
              Sign Up
            </Link>
          </div>
        </div>
      }
    >
      <InputEmail
        variant="bordered"
        color={errors.email?.message ? "danger" : "default"}
        isInvalid={errors.email?.message ? true : false}
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <InputPassword
        variant="bordered"
        color={errors.password?.message ? "danger" : "default"}
        isInvalid={errors.password?.message ? true : false}
        errorMessage={errors.password?.message}
        {...register("password")}
      />
      <InputPassword
        variant="bordered"
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
