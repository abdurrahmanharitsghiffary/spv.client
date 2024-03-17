import MembershipPage from "@/components/page/merbership-page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Membership requests",
  description: "My membership requests",
};

export default function Page() {
  return <MembershipPage />;
}
