"use client";
import { useGetSearchResult } from "@/lib/api/search";
import React from "react";
import Slider from "./slider";
import { UserAccountPublic } from "@/types/user";
import UserCardSquare from "./user/user-card-square";
import { TypographyH4 } from "./ui/typography";

export default function FollowSuggestion() {
  const { searchResult } = useGetSearchResult({
    type: "user",
    filter: "not_followed",
    limit: 10,
  });

  if (((searchResult?.data as UserAccountPublic[]) ?? [])?.length < 1)
    return null;

  return (
    <div className="w-full flex flex-col gap-2 px-2">
      <TypographyH4 className="!text-base px-2">
        Users recommendations
      </TypographyH4>
      <Slider>
        {((searchResult?.data as UserAccountPublic[]) ?? []).map((user) => (
          <UserCardSquare user={user} key={user?.id} />
        ))}
      </Slider>
    </div>
  );
}
