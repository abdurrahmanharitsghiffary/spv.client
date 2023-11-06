"use client";
import React from "react";
import FormLayout from "./layout";
import { Button } from "@nextui-org/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputPassword from "./input/password";
import { toast } from "react-toastify";
import axios from "axios";
import { constructUrl, urlBase } from "@/lib/endpoints";
import { useRouter } from "next/navigation";
import {
  PasswordValidationSchema,
  passwordValidationSchema,
} from "@/lib/zod-schema/auth";

export default function ChangePasswordForm({ token }: { token: string }) {
  const {
    handleSubmit,
    register,
    formState: {
      errors: { password, confirmPassword },
    },
    reset,
  } = useForm<PasswordValidationSchema>({
    resolver: zodResolver(passwordValidationSchema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<PasswordValidationSchema> = async (data) => {
    try {
      await toast.promise(
        axios
          .post(constructUrl([urlBase("/account/resetpassword"), token]), data)
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
        {
          error: {
            render({ data }) {
              return (data as any)?.data?.message ?? "Something went wrong";
            },
          },
          pending: "Reseting password...",
          success: "Password successfully changed",
        }
      );

      router.push("/");
    } catch (err) {}
  };

  return (
    <FormLayout
      onSubmit={handleSubmit(onSubmit)}
      title="Reset password"
      footer={
        <Button type="submit" color="primary">
          Change password
        </Button>
      }
    >
      <InputPassword
        variant="bordered"
        {...register("password")}
        color={password?.message ? "danger" : "default"}
        isInvalid={password?.message ? true : false}
        errorMessage={password?.message}
        label="Password"
        placeholder="Enter your new password..."
      />
      <InputPassword
        variant="bordered"
        {...register("confirmPassword")}
        color={confirmPassword?.message ? "danger" : "default"}
        isInvalid={confirmPassword?.message ? true : false}
        errorMessage={confirmPassword?.message}
        label="Confirm"
        placeholder="Enter again your password"
      />
    </FormLayout>
  );
}
