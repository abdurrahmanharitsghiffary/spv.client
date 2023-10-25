import React from "react";
import Link from "next/link";
import { TypographyH4, TypographyMuted } from "../ui/typography";

export default function ProfileInfo({
  followedCount,
  followersCount,
  postCount,
  userId,
}: {
  userId: number;
  followersCount: number;
  postCount: number;
  followedCount: number;
}) {
  return (
    <div className="w-full flex my-8 justify-evenly mx-auto">
      {["Posts", "Followers", "Following"].map((i) => {
        if (i === "Posts") {
          return (
            <div
              key={i}
              className="grid items-center text-center w-[33%] grid-cols-1"
            >
              <TypographyH4>{postCount ?? 0}</TypographyH4>
              <TypographyMuted>Posts</TypographyMuted>
            </div>
          );
        }

        return (
          <Link
            href={`/users/${userId}/${i.toLowerCase()}`}
            key={i}
            className="grid items-center text-center w-[33%] grid-cols-1"
          >
            <TypographyH4>
              {i === "Posts"
                ? postCount ?? 0
                : i === "Followers"
                ? followersCount ?? 0
                : followedCount ?? 0}
            </TypographyH4>
            <TypographyMuted>{i}</TypographyMuted>
          </Link>
        );
      })}
    </div>
  );
}
