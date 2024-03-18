import UserPage from "@/components/page/users-page";
import { Metadata } from "next";
import React from "react";

export function generateMetadata({ params }: any): Metadata {
  return {
    description: "User page",
    title: `User - ${params?.userId}`,
    keywords:
      "Users, User, Profile, User page, user details, user informations",
  };
}

export default function Page({ params }: { params: { userId: string } }) {
  return <UserPage params={params} />;
}
