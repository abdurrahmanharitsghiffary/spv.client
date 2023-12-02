"use client";
import { urlBase } from "@/lib/endpoints";
import { Button, ButtonProps } from "@nextui-org/button";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

export default function SendVerifyButton({
  children,
  color,
  email,
  ...rest
}: ButtonProps & { email: string }) {
  return (
    <Button
      color={color ?? "primary"}
      {...rest}
      onClick={async () => {
        try {
          await toast.promise(
            axios
              .post(urlBase("/account/verify"), { email })
              .then((res) => res.data)
              .catch((err) => Promise.reject(err?.response?.data)),
            {
              error: {
                render({ data }) {
                  return (data as any)?.message ?? "Something went wrong!";
                },
              },
              pending: "Submitting...",
              success: {
                render({ data }) {
                  return (
                    data?.message ??
                    `If a matching account was found & email is valid, an email was sent to ${email} to verify your email.`
                  );
                },
              },
            }
          );
        } catch (err) {
          console.error(err);
        } finally {
        }
      }}
    >
      {children ?? "Request verify Url"}
    </Button>
  );
}
