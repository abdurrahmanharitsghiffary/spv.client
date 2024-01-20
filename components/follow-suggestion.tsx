"use client";
import { useGetSearchResult } from "@/lib/api/search";
import React, { useEffect, useState } from "react";
import Slider from "./slider";
import { UserAccountPublic } from "@/types/user";
import UserCardSquare from "./user/user-card-square";
import { TypographyH4 } from "./ui/typography";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";
import { UserCardSquareSkeleton } from "./user/user-card-skeleton";
import IconButton from "./button/icon-button";
import { FiX } from "react-icons/fi";

export default function FollowSuggestion() {
  const [isShow, setIsShow] = useState(true);
  console.log(isShow, "Is show");
  const {
    resp,
    isFetchNextNotAvailable,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isSuccess,
    fetchNextPage,
  } = useGetSearchResult({
    type: "user",
    filter: "not_followed",
    limit: 10,
  });

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
    options: {
      threshold: 1,
    },
  });

  const data = (resp?.data as unknown as UserAccountPublic[]) ?? [];
  const resultCountIsEmpty = isSuccess && data.length < 1;

  useEffect(() => {
    const isShowSuggestion = JSON.parse(
      localStorage.getItem("show_user_suggestion") ?? "{}"
    );

    const expiredAt = isShowSuggestion.expiredAt;

    const isExpired = new Date(expiredAt).getTime() < Date.now();
    console.log(isExpired, "Exp");
    if (!isShowSuggestion.status && !isExpired) {
      setIsShow(false);
    }
  }, []);

  const handleCloseClick = () => {
    setIsShow(false);
    localStorage.setItem(
      "show_user_suggestion",
      JSON.stringify({
        status: false,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    );
  };

  if (resultCountIsEmpty || !isShow) return null;

  return (
    <div className="w-full flex flex-col gap-2 px-2">
      {isSuccess && (
        <div className="w-full flex items-center justify-between">
          <TypographyH4 className="!text-base px-2">
            Users recommendations
          </TypographyH4>
          <IconButton onClick={handleCloseClick}>
            <FiX />
          </IconButton>
        </div>
      )}
      <Slider classNames={{ body: "gap-2" }}>
        {isSuccess &&
          data.map((user) => <UserCardSquare user={user} key={user?.id} />)}
        <div ref={ref} className="h-full"></div>
        {isFetchingNextPage && <Spinner className="my-auto" />}
      </Slider>
    </div>
  );
}
