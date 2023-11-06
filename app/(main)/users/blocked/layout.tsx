import UsersGridLayout from "@/components/layout/users-grid-layout";
import React from "react";

export default function BlockedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsersGridLayout className="pt-8 px-2 pb-16">{children}</UsersGridLayout>
  );
}
