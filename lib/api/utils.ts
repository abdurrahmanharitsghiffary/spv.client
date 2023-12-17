"use client";

import { ApiPagingObjectResponse } from "@/types/response";
import { InfiniteData } from "@tanstack/react-query";

export const flatInfiniteData = <T>(
  infiniteData: InfiniteData<ApiPagingObjectResponse<T[]>>
): T[] => {
  return infiniteData.pages
    .filter((p) => p !== undefined)
    .map((item) => item.data)
    .flat();
};
