"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { SearchAllData, SearchOptions } from "@/types";
import { PostExtended } from "@/types/post";
import { JsendWithPaging } from "@/types/response";
import { UserAccountPublic } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { keys } from "../queryKey";
import { searchRoute } from "../endpoints";

export const useGetSearchResult = (
  options: SearchOptions,
  config?: AxiosRequestConfig
) => {
  const request = useAxiosInterceptor();

  const { data: searchResult, ...rest } = useQuery<
    JsendWithPaging<UserAccountPublic[] | PostExtended[] | SearchAllData>
  >({
    queryKey: keys.search(options),
    queryFn: () =>
      request
        .get(searchRoute(options), config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
  });

  return { searchResult, ...rest };
};
