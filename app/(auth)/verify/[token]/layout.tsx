import Layout from "@/components/layout/layout";
import React from "react";

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
