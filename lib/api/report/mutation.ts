"use client";

import { urlBase } from "@/lib/endpoints";
import { useMutate } from "../hooks";
import { ReportType } from "@/types";

export const useReport = () => {
  const {
    mutate: report,
    mutateAsync: reportAsync,
    ...rest
  } = useMutate<{
    id: number;
    images?: File[];
    report: string;
    type: ReportType;
  }>({ method: "post", baseUrl: urlBase("/report") });

  return { report, reportAsync, ...rest };
};

export const useDeleteReport = () => {
  const {
    mutate: deleteReport,
    mutateAsync: deleteReportAsync,
    ...rest
  } = useMutate<undefined, { reportId: number }>({
    method: "delete",
    baseUrl: urlBase("/report/:reportId"),
  });

  return { deleteReport, deleteReportAsync, ...rest };
};
