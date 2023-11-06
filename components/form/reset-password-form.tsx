"use client";
import React, { useState } from "react";
import { z } from "zod";
import FormLayout from "./layout";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import axios from "axios";
import { urlBase } from "@/lib/endpoints";
import { toast } from "react-toastify";

const emailValidation = z.string().email({ message: "Invalid email format" });

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit: (e: React.FormEvent<HTMLDivElement>) => void = async (
    e
  ) => {
    e.preventDefault();
    try {
      const cleanEmail = await emailValidation.safeParseAsync(email);
      if (!cleanEmail.success) throw new Error("Invalid email format");
      await toast.promise(
        axios
          .post(urlBase("/account/resetpassword"), {
            email,
          })
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
        {
          error: {
            render({ data }) {
              return (data as any)?.message;
            },
          },
          pending: "Submitting...",
          success: {
            render({ data }) {
              return (
                (data as any)?.message ??
                `If a matching account was found, an email was sent to ${email} to allow you to reset your password.`
              );
            },
            autoClose: 4000,
          },
        }
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setEmail("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <FormLayout
      onSubmit={(e: React.FormEvent<HTMLDivElement>) => handleSubmit(e)}
      title="Reset password"
      footer={
        <Button type="submit" color="primary">
          Submit
        </Button>
      }
    >
      <Input
        variant="bordered"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={handleInputChange}
      />
    </FormLayout>
  );
}
