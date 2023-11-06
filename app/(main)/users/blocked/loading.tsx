import UserCardSkeleton from "@/components/user/user-card-skeleton";
import React from "react";

export default function BlockedUserLoading() {
  return [1, 2, 3].map((item) => (
    <UserCardSkeleton className="rounded-none shadow-none" key={item} />
  ));
}
