"use client";

import { ApiPagingObjectResponse } from "@/types/response";
import { InfiniteData } from "@tanstack/react-query";
import { produce } from "immer";

type InfinitePagingData<T> =
  | InfiniteData<ApiPagingObjectResponse<T[]>>
  | undefined;

export const prependPagingData = <T = unknown>(
  oldData: InfinitePagingData<T>,
  newData: unknown,
  isRemoveOldest: boolean = false
): InfinitePagingData<T> => {
  if (!oldData) return oldData;
  const pages = (oldData?.pages ?? []).filter((page) => page !== undefined);

  const newPages = pages.map((page, i) => {
    if (i === 0) {
      const newDatas = [newData, ...(page?.data as any[])];
      return {
        ...page,
        data: newDatas,
        pagination: {
          ...page?.pagination,
          total_records: page?.pagination?.totalRecords + 1,
          result_count: newDatas?.length,
        },
      };
    }
    if (i === pages.length - 1 && isRemoveOldest) {
      const slicedData = page.data.slice(0, -1);
      return {
        ...page,
        data: slicedData,
        pagination: {
          ...page?.pagination,
          total_records: page?.pagination?.totalRecords + 1,
          result_count: slicedData?.length,
        },
      };
    }
    return page;
  });

  return {
    ...oldData,
    pages: [...newPages],
  };
};

export const appendPagingData = <T = unknown>(
  oldData: InfinitePagingData<T>,
  newData: unknown,
  isRemoveOldest?: boolean
): InfinitePagingData<T> => {
  if (!oldData) return oldData;
  const pages = (oldData?.pages ?? []).filter((page) => page !== undefined);

  const newPages = pages.map((page, i) => {
    if (i === pages.length - 1) {
      const newDatas = [...(page?.data as any[]), newData];
      return {
        ...page,
        data: newDatas,
        pagination: {
          ...page?.pagination,
          total_records: page?.pagination?.totalRecords + 1,
          result_count: newDatas?.length,
        },
      };
    }
    if (i === 0 && isRemoveOldest) {
      const slicedData = page.data.slice(1);
      return {
        ...page,
        data: slicedData,
        pagination: {
          result_count: slicedData.length,
          total_records: page?.pagination?.totalRecords + 1,
        },
      };
    }
    return page;
  });

  return {
    ...oldData,
    pages: [...newPages] as any,
  };
};

export const updatePagingData = <T = unknown>(
  oldData: InfinitePagingData<T>,
  newData: T,
  idKey: keyof T
): InfinitePagingData<T> => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((p) => {
      if (!p) return p;
      return {
        ...p,
        data: p.data.map((c) => {
          if ((c as any)[idKey] === (newData as any)[idKey]) {
            return { ...c, ...newData };
          }
          return c;
        }),
      };
    }),
  };
};

export const deletePagingData = <T = unknown>(
  oldData: InfinitePagingData<T>,
  dataId: number,
  idKey: keyof T
): InfinitePagingData<T> => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((p) => {
      if (!p) return p;
      const filteredData = p.data.filter((c) => (c as any)[idKey] !== dataId);
      return {
        ...p,
        data: filteredData,
        pagination: {
          ...p.pagination,
          total_records: p.pagination.totalRecords - 1,
          result_count: filteredData.length,
        },
      };
    }),
  };
};

export class Immer {
  static updatePagingData<T>(
    oldData: InfinitePagingData<T>,
    newData: T,
    dataKey: keyof T
  ): InfinitePagingData<T> {
    return produce(oldData, (draft) => {
      if (draft?.pages) {
        draft.pages.forEach((p, pi) => {
          p.data.forEach((d, di) => {
            if ((d as any)[dataKey] === newData[dataKey]) {
              draft.pages[pi].data[di] = newData as any;
            }
          });
        });
      }
    });
  }

  static deletePagingData<T>(
    oldData: InfinitePagingData<T>,
    dataId: number,
    idKey: keyof T
  ): InfinitePagingData<T> {
    return produce(oldData, (draft) => {
      if (draft?.pages) {
        draft.pages.forEach((p, pi) => {
          p.data.forEach((d) => {
            if ((d as any)[idKey] === dataId) {
              draft.pages[pi].data = p.data.filter(
                (t) => (t as any)[idKey] !== dataId
              );
              draft.pages[pi].pagination.resultCount -= 1;
              draft.pages[pi].pagination.totalRecords -= 1;
            }
          });
        });
      }
    });
  }
}
