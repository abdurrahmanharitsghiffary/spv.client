"use client";
import React, { useEffect } from "react";
import ModalLayoutV2 from "../layoutV2";
import { useShowChangePasswordModalControls } from "@/hooks/use-change-password-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  ChangePasswordValidationSchema,
  changePasswordValidationSchema,
} from "@/lib/zod-schema/auth";
import InputPassword from "@/components/input/password";
import { Button } from "@nextui-org/button";
import { useConfirm } from "@/stores/confirm-store";
import { toast } from "react-toastify";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { urlBase } from "@/lib/endpoints";
import { TypographyH3 } from "@/components/ui/typography";
import { DISCARD_CHANGE_CONFIRM_PROPS } from "@/lib/consts";

function ChangePasswordModal() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<ChangePasswordValidationSchema>({
    resolver: zodResolver(changePasswordValidationSchema),
    defaultValues: { confirmPassword: "", currentPassword: "", password: "" },
  });
  const request = useAxiosInterceptor();
  const confirm = useConfirm();
  const { isOpen, onClose } = useShowChangePasswordModalControls();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<ChangePasswordValidationSchema> = async (
    data
  ) => {
    const choice = await confirm({
      body: "Change your account password?",
      title: "Change password",
      confirmLabel: "Save changes",
      confirmColor: "primary",
      closeLabel: "Cancel",
    });
    if (!choice) return null;
    await toast.promise(
      request
        .patch(urlBase("/me/account/changepassword"), data)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
      {
        pending: "Changing password...",
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
        success: "Password successfully changed",
      }
    );
  };

  const handleCancel = async () => {
    await confirm(DISCARD_CHANGE_CONFIRM_PROPS);
    reset();
  };

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      footer={
        <div className="flex gap-2">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" color="primary" form="changepasswordform">
            Submit
          </Button>
        </div>
      }
    >
      <form
        id="changepasswordform"
        className="flex p-4 px-0 flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TypographyH3 className="!text-base">Change password</TypographyH3>
        <InputPassword
          variant="bordered"
          label="Current password"
          placeholder="your current password"
          control={control}
          name="currentPassword"
        />
        <InputPassword
          variant="bordered"
          label="New password"
          placeholder="Enter your new password"
          control={control}
          name="password"
        />
        <InputPassword
          variant="bordered"
          label="Confirm"
          placeholder="Enter again your new password"
          control={control}
          name="confirmPassword"
        />
      </form>
    </ModalLayoutV2>
  );
}

export default ChangePasswordModal;
