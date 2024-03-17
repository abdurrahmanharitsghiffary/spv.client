import Layout from "@/components/layout/layout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset password page.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="my-auto flex justify-center items-center h-full w-full px-4 min-h-[100dvh]">
      {children}
    </Layout>
  );
}
