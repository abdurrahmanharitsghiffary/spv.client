"use client";

import { useGetSearchResult } from "@/lib/api/search";
import { UserAccountPublic } from "@/types/user";
import { Input, InputProps } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { TypographyMuted } from "../ui/typography";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/react";
import { listboxUserProps } from "./listbox-user-props";
import { getUserSimplified } from "@/lib/getUserSimplified";

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

  const [selectedKeys, setSelectetedKeys] = useState<any>(undefined);
  const results = (searchResult?.data ?? []) as UserAccountPublic[];
  const reset = () => {
    setFilterText("");
    setSelectetedKeys(undefined);
  };

  // const handleInputKeyDown = useCallback(
  //   (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       itemRef.current?.click();
  //       setCurrentFocus(-1);
  //       setFilterText("");
  //     }
  //     if (e.key === "ArrowDown") {
  //       if (itemsLength - 1 === currentFocus) return null;
  //       e.preventDefault();
  //       itemRef.current?.scrollIntoView(true);
  //       setCurrentFocus((c) => c + 1);
  //     } else if (e.key === "ArrowUp") {
  //       if (currentFocus === 0) return null;
  //       e.preventDefault();
  //       itemRef.current?.scrollIntoView(false);
  //       setCurrentFocus((c) => c - 1);
  //     }
  //   },
  //   [itemRef, itemsLength, currentFocus]
  // );

  // const handleListsAction = (key: React.Key) => {
  //   reset();
  //   onItemClick(results.find((user) => user.id === Number(key)));
  // };

  const handleListPress = (item: UserAccountPublic) => {
    onItemClick(item);
    reset();
  };

  return (
    <div className="w-full flex flex-col relative">
      <Input
        // onKeyDown={handleInputKeyDown}
        value={filterText}
        onValueChange={setFilterText}
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
            labelPlacement === "outside" && label ? "mt-20" : "mt-12"
          )}
        >
          <Listbox
            className="py-4 px-2 gap-2"
            selectionMode="none"
            items={results as UserAccountPublic[]}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectetedKeys}
            emptyContent={
              <TypographyMuted className="!text-sm">
                No result found.
              </TypographyMuted>
            }
            // onAction={handleListsAction}
          >
            {(item) => (
              <ListboxItem
                key={item.id}
                onPress={() => handleListPress(item)}
                {...listboxUserProps(getUserSimplified(item))}
              />
            )}
          </Listbox>
        </ScrollShadow>
      )}
    </div>
  );
}
