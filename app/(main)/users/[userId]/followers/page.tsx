import FollowersPage from "@/components/page/followers-page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  description: "Followers page",
  title: "Followers",
  keywords:
    "Users, User, Profile, User page, user details, user informations, followers, following",
};

export default function UserFollowersPage() {
  return <FollowersPage />;
}
