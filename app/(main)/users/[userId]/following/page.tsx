import React from "react";
import FollowingPage from "@/components/page/following-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  description: "Followed users page",
  title: "Following",
  keywords:
    "Users, User, Profile, User page, user details, user informations, followers, following",
};

export default function UserFollowingPage() {
  return <FollowingPage />;
}
