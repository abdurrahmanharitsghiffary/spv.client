"use client";
import React, { useEffect } from "react";
import FormLayout from "./layout";
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputPassword from "../input/password";
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
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<PasswordValidationSchema>({
    resolver: zodResolver(passwordValidationSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (isSubmitSuccessful) {
      router.push("/");
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<PasswordValidationSchema> = async (data) => {
    if (isSubmitting) return null;
    try {
      await toast.promise(
        axios
          .post(constructUrl([urlBase("/account/resetpassword"), token]), data)
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
        {
          error: {
            render({ data }) {
              return (data as any)?.message ?? "Something went wrong";
            },
          },
          pending: "Reseting password...",
          success: "Password successfully changed",
        }
      );
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
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your new password..."
      />
      <InputPassword
        variant="bordered"
        control={control}
        name="confirmPassword"
        label="Confirm"
        placeholder="Enter again your password"
      />
    </FormLayout>
  );
}
