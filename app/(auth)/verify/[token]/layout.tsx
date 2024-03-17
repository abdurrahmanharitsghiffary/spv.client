import Layout from "@/components/layout/layout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verify account",
  description: "Verify account page.",
};

export default function VerifyAccountLayout({
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
