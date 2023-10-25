"use client";
import {
  useFollowAccount,
  useUnfollowAccount,
} from "@/lib/api/follow/mutation";
import { useGetUserIsFollowed } from "@/lib/apiv2";
import { Button, ButtonProps } from "@nextui-org/button";
import clsx from "clsx";
import React from "react";

export default function FollowButton({
  userId,
  className,
  ...rest
}: ButtonProps & { userId: number }) {
  const { isFollowed } = useGetUserIsFollowed(userId);
  const { followAccount } = useFollowAccount();
  const { unfollowAccount } = useUnfollowAccount();
  const handleFollow = () => {
    if (isFollowed?.data) {
      return unfollowAccount({ userId: userId });
    }
    return followAccount({ userId: userId });
  };
  return (
    <Button
      className={clsx("font-semibold", className)}
      color={isFollowed?.data ? "default" : "primary"}
      {...rest}
      onClick={handleFollow}
    >
      {isFollowed?.data ? "Unfollow" : "Follow"}
    </Button>
  );
}
