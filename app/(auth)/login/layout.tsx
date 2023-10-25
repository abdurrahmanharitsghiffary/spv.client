import Layout from "@/components/layout/layout";
import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="my-auto flex justify-center items-center h-full w-full px-4 min-h-screen">
      {children}
    </Layout>
  );
}
