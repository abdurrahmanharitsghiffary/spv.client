import BlockedUsers from "@/components/user/blocked-users";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blocked users",
  description: "Blocked users page",
};

export default function BlockedPage() {
  return <BlockedUsers />;
}
