"use client";
import React from "react";
import InputPassword from "../input/password";
import FormLayout from "./layout";
import { Button, Link } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputEmail from "../input/email";
import NextLink from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@/lib/api/auth";
import { toast } from "react-toastify";
import {
  LoginValidationSchema,
  loginValidationSchema,
} from "@/lib/zod-schema/auth";
import ValidationErrorText from "../validation-error-text";
import { useSearchParams } from "next/navigation";
import TextDivider from "../text-divider";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: { confirmPassword: "", email: "", password: "" },
  });
  const { error, loginAsync } = useLogin();
  const googleLoginErrorMessage = searchParams.get("err_message");
  const errorMessage: string = (error as any)?.message ?? null;

  const onSubmit: SubmitHandler<LoginValidationSchema> = async (data) => {
    await toast.promise(loginAsync(data), {
      error: {
        render({ data }) {
          return (data as any)?.message ?? "Something went wrong!";
        },
      },
      pending: "Login to account....",
      success: {
        render(props) {
          return "Login successful";
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
          <ValidationErrorText className="!text-[0.875rem]">
            {errorMessage ?? googleLoginErrorMessage ?? ""}
          </ValidationErrorText>
          <Link as={NextLink} size="sm" href="/resetpassword">
            Forget your password?
          </Link>
          <Button type="submit" size="md" radius="sm" color="primary">
            Login
          </Button>
          <TextDivider>or</TextDivider>
          <Button
            size="md"
            color="secondary"
            type="button"
            radius="sm"
            as={NextLink}
            href="http://localhost:5000/api/auth/google"
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
      <InputEmail variant="bordered" control={control} name="email" />
      <InputPassword
        variant="bordered"
        color={errors.password?.message ? "danger" : "default"}
        control={control}
        name="password"
      />
      <InputPassword
        variant="bordered"
        label="Confirm"
        placeholder="Enter again your password"
        control={control}
        name="confirmPassword"
      />
    </FormLayout>
  );
}
