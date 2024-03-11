"use client";

import { urlBase } from "@/lib/endpoints";
import { useMutate } from "../hooks";

export const useReportBug = () => {
  const {
    mutate: reportBug,
    mutateAsync: reportBugAsync,
    ...rest
  } = useMutate<{ description: string; images?: File[] }>({
    baseUrl: urlBase("/bugs"),
    method: "post",
  });

  return { reportBug, reportBugAsync, ...rest };
};
