"use client";
import React, { useEffect } from "react";
import { useShowDeleteAccountModalControls } from "@/hooks/use-delete-account";
import ModalLayout from "../layout";
import { zPassword } from "@/lib/zod-schema";
import { toast } from "react-toastify";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { urlBase } from "@/lib/endpoints";
import { useRouter } from "next/navigation";
import { useSetSession } from "@/stores/auth-store";
import InputPassword from "@/components/input/password";
import { Button } from "@nextui-org/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordValidation = z.object({
  password: zPassword("Password"),
});

type PasswordValidationSchema = z.infer<typeof passwordValidation>;

function DeleteAccountModal() {
  const {
    handleSubmit,
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm<PasswordValidationSchema>({
    resolver: zodResolver(passwordValidation),
    defaultValues: {
      password: "",
    },
  });
  const request = useAxiosInterceptor();
  const setSession = useSetSession();
  const router = useRouter();
  const { isOpen, onClose } = useShowDeleteAccountModalControls();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setSession(null);
      router.push("/login");
      onClose();
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<PasswordValidationSchema> = async (data) => {
    if (isSubmitting) return null;
    await toast.promise(
      request
        .delete(urlBase("/me/account"), {
          data: { currentPassword: data.password },
        })
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
      {
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
        pending: "Submitting...",
        success: "Account successfully deleted",
      }
    );
  };

  return (
    <ModalLayout
      placement="center"
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        footer: "px-4",
        wrapper: "w-[90%]",
      }}
      footer={
        <div className="flex gap-2 items-center">
          <Button>Cancel</Button>
          <Button color="danger" form="deleteaccountform" type="submit">
            Delete Account
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} id="deleteaccountform">
        <InputPassword
          control={control}
          name="password"
          label="Current password"
          placeholder="Enter your current account password"
        />
      </form>
    </ModalLayout>
  );
}

export default DeleteAccountModal;
