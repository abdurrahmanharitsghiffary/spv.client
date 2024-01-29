"use client";

import { SearchAllData, SearchOptions } from "@/types";
import { Post } from "@/types/post";
import { UserAccountPublic } from "@/types/user";
import { AxiosRequestConfig } from "axios";
import { keys } from "../queryKey";
import { searchRoute } from "../endpoints";
import { useInfinite } from "./hooks";

export const useGetSearchResult = (
  options: SearchOptions,
  config?: AxiosRequestConfig
) => {
  const q = {
    ...options,
    limit: (options.limit ?? 10).toString() ?? "20",
    offset: (options.offset ?? 0).toString() ?? "0",
  };

  const { data: resp, ...rest } = useInfinite<
    UserAccountPublic | Post | SearchAllData
  >({
    queryKey: keys.search(options),
    url: searchRoute(options),
    config,
    query: q,
  });

  return { resp, ...rest };
};
