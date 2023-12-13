"use client";

import { useGetSearchResult } from "@/lib/api/search";
import { getUserSimplified } from "@/lib/getUserSimplified";
import { UserAccountPublic } from "@/types/user";
import { Input, InputProps } from "@nextui-org/input";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import UserCard from "./user-card";
import { TypographyMuted } from "../ui/typography";

export default function UserAutocomplete({
  onItemClick,
  inputProps = {},
  isScrollShadowEnabled = true,
}: {
  inputProps?: InputProps;
  isScrollShadowEnabled?: boolean;
  onItemClick: (item: UserAccountPublic) => void;
}) {
  const {
    labelPlacement = "outside",
    label,
    type,
    placeholder,
    onKeyDown: _1,
    onValueChange: _2,
    value: _3,
    startContent: _4,
    endContent: _5,
    ...rest
  } = inputProps;
  const [filterText, setFilterText] = useState("");
  const { isLoading, searchResult, isSuccess } = useGetSearchResult({
    q: filterText,
    type: "user",
  });

  const itemsLength = ((searchResult?.data as any) ?? []).length ?? 0;

  const itemRef = useRef<HTMLLIElement | null>(null);
  const [currentFocus, setCurrentFocus] = useState(-1);

  const handleUserSelection = (item: UserAccountPublic) => {
    onItemClick(item);
    setFilterText("");
  };

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
      if (e.key === "Enter") {
        itemRef.current?.click();
        setCurrentFocus(-1);
        setFilterText("");
      }
      if (e.key === "ArrowDown") {
        if (itemsLength - 1 === currentFocus) return null;
        e.preventDefault();
        itemRef.current?.scrollIntoView(true);
        setCurrentFocus((c) => c + 1);
      } else if (e.key === "ArrowUp") {
        if (currentFocus === 0) return null;
        e.preventDefault();
        itemRef.current?.scrollIntoView(false);
        setCurrentFocus((c) => c - 1);
      }
    },
    [itemRef, itemsLength, currentFocus]
  );

  const handleValueChange = (value: string) => {
    setCurrentFocus(-1);
    setFilterText(value);
  };

  return (
    <div className="w-full flex flex-col relative">
      <Input
        onKeyDown={handleInputKeyDown}
        value={filterText}
        onValueChange={handleValueChange}
        labelPlacement={labelPlacement}
        startContent={<FiSearch size={18} />}
        classNames={{ clearButton: "mt-[50%] -translate-y-1/2" }}
        endContent={
          isLoading && filterText ? (
            <Spinner size="sm" className="text-[1.25rem" color="default" />
          ) : filterText ? (
            <FiChevronUp onClick={() => setFilterText("")} />
          ) : (
            <FiChevronDown />
          )
        }
        type={type ?? "text"}
        label={label}
        placeholder={placeholder ?? "Search users..."}
        {...rest}
      />
      {filterText && (
        <ScrollShadow
          hideScrollBar
          isEnabled={isScrollShadowEnabled}
          className={clsx(
            "bg-content1 rounded-large shadow-medium absolute left-1/2 -translate-x-1/2 w-full z-20 max-h-[400px]",
            labelPlacement === "outside" ? "mt-20" : "mt-12"
          )}
        >
          <ul className="w-full grid grid-cols-1 ">
            {itemsLength > 0 ? (
              isSuccess &&
              ((searchResult?.data as UserAccountPublic[]) ?? []).map(
                (item, i) => (
                  <li
                    key={item.id}
                    ref={(node) => {
                      if (i === currentFocus) {
                        itemRef.current = node;
                      }
                    }}
                    className={clsx(
                      "w-full hover:bg-content2 cursor-pointer",
                      currentFocus === i ? "bg-content2" : ""
                    )}
                    onClick={() => handleUserSelection(item)}
                  >
                    <UserCard
                      className="bg-transparent shadow-none rounded-none border-none p-0"
                      hideLink
                      withFollowButton={false}
                      user={getUserSimplified(item)}
                    />
                  </li>
                )
              )
            ) : (
              <TypographyMuted className="!text-sm p-2 px-4">
                No result found.
              </TypographyMuted>
            )}
          </ul>
        </ScrollShadow>
      )}
    </div>
  );
}
