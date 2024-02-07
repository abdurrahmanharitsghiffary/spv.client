"use client";
import { CountType, Counts } from "@/types";
import { useQ } from "./hooks";
import { urlBase } from "../endpoints";
import { keys } from "../queryKey";

export const useGetCounts = (type?: CountType[]) => {
  const { data: resp, ...rest } = useQ<Counts>({
    url: urlBase("/counts"),
    query: { type: (type ?? []).join(",") },
    queryKey: keys.counts(type),
  });
  return { resp, ...rest };
};
