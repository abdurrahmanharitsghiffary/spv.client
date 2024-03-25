"use client";

import { ReportType } from "@/types";
import { useInfinite } from "../hooks";
import { urlBase } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";

type GetReportOptions = {
  type?: ReportType | "all";
  offset?: number;
  limit?: number;
};

export const useGetReport = ({
  limit = 20,
  offset = 0,
  type = "all",
}: GetReportOptions) => {
  const q = { limit: limit.toString(), offset: offset.toString(), type };

  const { data: resp, ...rest } = useInfinite({
    query: q,
    url: urlBase("/report"),
    queryKey: [...keys.report, q],
  });

  return { resp, ...rest };
};
