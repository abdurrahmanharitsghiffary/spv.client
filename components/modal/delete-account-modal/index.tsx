"use client";
import React, { useEffect, useState } from "react";
import { useShowDeleteAccountModalControls } from "@/hooks/use-delete-account";
import ModalLayout from "../layout";
import { password as passwordValidation } from "@/lib/schema";
import { toast } from "react-toastify";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { urlBase } from "@/lib/endpoints";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/stores/auth-store";
import InputPassword from "@/components/form/input/password";
import { Button } from "@nextui-org/button";
// FIX VALIDATE ERRORS
export default function DeleteAccountModal() {
  const request = useAxiosInterceptor();
  const { setSession } = useAuthSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const { isOpen, onClose } = useShowDeleteAccountModalControls();

  useEffect(() => {
    if (errorMessage) {
      passwordValidation
        .safeParseAsync(password)
        .then((res) => {
          if (!res.success) {
            setErrorMessage(res.error.errors?.[0]?.message);
          } else {
            setErrorMessage(null);
          }
        })
        .catch((err) => err);
    }
  }, [errorMessage, password]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await passwordValidation.safeParseAsync(password);
    if (!result.success) {
      console.error(result.error.errors);
      setErrorMessage(result.error.errors?.[0]?.message);
    } else {
      await toast.promise(
        request
          .delete(urlBase("/me/account"), {
            data: { currentPassword: result.data },
          })
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
        {
          error: {
            render({ data }) {
              return (data as any)?.data?.message ?? "Something went wrong!";
            },
          },
          pending: "Submitting...",
          success: "Account successfully deleted",
        }
      );
      setErrorMessage(null);
      setSession(null);
      router.push("/login");
    }
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
      <form onSubmit={handleSubmit} id="deleteaccountform">
        <InputPassword
          isInvalid={errorMessage ? true : false}
          errorMessage={errorMessage}
          color={errorMessage ? "danger" : "default"}
          value={password}
          onChange={handleInputChange}
          label="Current password"
          placeholder="Enter your current account password"
        />
      </form>
    </ModalLayout>
  );
}
