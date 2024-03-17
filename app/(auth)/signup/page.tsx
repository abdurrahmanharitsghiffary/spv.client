import SignUpForm from "@/components/form/signup-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Register new account.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
