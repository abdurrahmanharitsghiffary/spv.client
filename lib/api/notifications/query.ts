"use client";

import { AxiosRequestConfig } from "axios";
import { useInfinite } from "../hooks";
import { myNotifications } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { Notification } from "@/types/notification";

export const useGetNotifications = (
  query: { limit?: number; offset?: number; order_by?: "latest" | "oldest" } = {
    limit: 20,
    offset: 0,
  },
  config?: AxiosRequestConfig
) => {
  const q = {
    offset: query.offset?.toString() ?? "0",
    limit: query.limit?.toString() ?? "20",
    order_by: query?.order_by ?? "latest",
  };

  const { data: resp, ...rest } = useInfinite<Notification>({
    query: q,
    url: myNotifications(query),
    config,
    queryKey: [...keys.meNotifications(), q],
  });

  return { resp, ...rest };
};
