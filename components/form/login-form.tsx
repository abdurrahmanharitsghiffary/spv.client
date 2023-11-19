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
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(loginValidationSchema),
  });
  const { error, loginAsync } = useLogin();
  const googleLoginErrorMessage = searchParams.get("err_message");
  console.log(googleLoginErrorMessage);
  const errorMessage: string = (error as any)?.data?.message ?? null;

  const onSubmit: SubmitHandler<LoginValidationSchema> = async (data) => {
    router.replace("/login");
    await toast.promise(loginAsync(data), {
      error: {
        render({ data }) {
          return (
            (data as any)?.data?.message ??
            (data as any)?.message ??
            "Something went wrong!"
          );
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
          <ValidationErrorText className="!text-[0.875rem]">
            {errorMessage ?? googleLoginErrorMessage ?? ""}
          </ValidationErrorText>
          <Link as={NextLink} size="sm" href="/resetpassword">
            Forget your password?
          </Link>
          <Button type="submit" size="md" radius="sm" color="primary">
            Login
          </Button>
          <div className="w-full text-center mx-auto before:w-full before:bg-divider before:p-[1px] before:rounded-md before:content-[''] before:inset-x-0 relative before:mx-auto before:absolute before:top-1/2 before:-translate-y-1/2">
            <p className="bg-background relative mx-auto px-2 w-fit">or</p>
          </div>
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
