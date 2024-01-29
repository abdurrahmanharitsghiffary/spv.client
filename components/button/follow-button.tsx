"use client";
import {
  useFollowAccount,
  useUnfollowAccount,
} from "@/lib/api/follow/mutation";
import { useGetUserIsFollowed } from "@/lib/api/users/query";
import { useSession } from "@/stores/auth-store";
import { Button, ButtonProps } from "@nextui-org/button";
import clsx from "clsx";
import React, { MouseEvent } from "react";

export default function FollowButton({
  userId,
  className,
  ...rest
}: ButtonProps & { userId: number }) {
  const session = useSession();
  const { isFollowed } = useGetUserIsFollowed(userId);
  const { followAccount } = useFollowAccount();
  const { unfollowAccount } = useUnfollowAccount();
  const handleFollow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isFollowed?.data) {
      return unfollowAccount({ params: { userId: userId } });
    }
    return followAccount({ body: { userId: userId } });
  };

  if (session?.id === userId) return null;

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
