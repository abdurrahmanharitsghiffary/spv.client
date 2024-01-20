"use client";

import React, { useState } from "react";
import InputSearch from "./input/search";
import { useRouter, useSearchParams } from "next/navigation";
import { InputProps } from "@nextui-org/input";
import clsx from "clsx";

export default function Search(
  props: InputProps & { wrapperClassName?: string }
) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [searchValue, setSearchValue] = useState(q);

  const router = useRouter();

  const getUrl = (query?: Record<string, string>) => {
    const url = new URL("/search", "http://localhost:3000");
    searchParams.forEach((v, k, p) => {
      url.searchParams.set(k, v);
    });
    for (let [k, v] of Object.entries(query ?? {})) {
      url.searchParams.set(k, v);
    }
    console.log(url.href.split(":3000")[1], "URL");
    return url.href.split(":3000")[1];
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(getUrl({ q: searchValue }));
  };

  return (
    <form
      className={clsx("w-full", props.wrapperClassName)}
      onSubmit={handleSubmit}
    >
      <InputSearch
        variant="faded"
        onClear={() => setSearchValue("")}
        onValueChange={setSearchValue}
        value={searchValue}
        radius="full"
        {...props}
      />
    </form>
  );
}
