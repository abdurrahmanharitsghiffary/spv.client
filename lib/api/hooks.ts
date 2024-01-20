"use client";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { ApiPagingObjectResponse, ApiResponseT } from "@/types/response";
import {
  QueryKey,
  SetDataOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useMemo } from "react";
import { getFormData } from "../getFormData";

type MutationMethod = "post" | "patch" | "delete" | "put";

export const useQ = <T>({
  query,
  queryKey,
  url,
  config,
  qConfig,
}: {
  queryKey?: QueryKey | undefined;
  query?: Record<string, any>;
  url: string;
  qConfig?: { enabled?: boolean; keepPreviousData?: boolean };
  config?: AxiosRequestConfig;
}) => {
  const request = useAxiosInterceptor();
  let newUrl = new URL(url);

  if (query) {
    for (let [key, value] of Object.entries(query ?? {})) {
      newUrl.searchParams.set(key, value);
    }
  }

  const q = useQuery<ApiResponseT<T>>({
    queryKey: query ? [...(queryKey ?? []), query] : queryKey,
    queryFn: () =>
      request
        .get(newUrl.href, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    ...qConfig,
  });

  return q;
};

export const useInfinite = <T>({
  queryKey,
  query,
  url,
  config,
  queryConfig,
}: {
  queryKey?: QueryKey | undefined;
  query: Record<string, any>;
  url: string;
  config?: AxiosRequestConfig;
  queryConfig?: {
    refetchOnWindowFocus?: boolean;
    enabled?: boolean;
  };
}) => {
  const request = useAxiosInterceptor();

  const reqUrl = new URL(url);

  for (let [key, value] of Object.entries(query)) {
    reqUrl.searchParams.set(key, value);
  }

  const {
    data: infiniteData,
    isSuccess,
    hasNextPage,
    isFetching,
    ...rest
  } = useInfiniteQuery<ApiPagingObjectResponse<T[]>>({
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      request
        .get(pageParam ? pageParam : reqUrl.href, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
    getNextPageParam: (res) => res?.pagination?.next ?? undefined,
    getPreviousPageParam: (res) => res?.pagination?.previous ?? undefined,
    ...queryConfig,
  });

  const isFetchNextNotAvailable = !hasNextPage && isSuccess;
  const data = useMemo(
    () =>
      url.includes("/search")
        ? { ...infiniteData?.pages?.[0] }
        : {
            ...infiniteData?.pages?.[0],
            data: infiniteData?.pages
              ?.map((page) =>
                (page?.data ?? []).filter((data) => data !== undefined)
              )
              .flat(),
          },
    [infiniteData]
  );

  return {
    data,
    infiniteData,
    hasNextPage,
    isSuccess,
    isFetching,
    isFetchNextNotAvailable,
    ...rest,
  };
};

export const useMutate = <T, P = {}>({
  method,
  invalidateTags,
  baseUrl,
}: {
  method: MutationMethod;
  baseUrl: string;
  invalidateTags?: (
    v: {
      body?: T | undefined;
      formData?: boolean | undefined;
      params?: Record<string, string | number> | P | undefined;
      config?: AxiosRequestConfig<any> | undefined;
    },
    d?: any
  ) => QueryKey[];
}) => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: (v: {
      body?: T;
      formData?: boolean;
      params?: Record<string, string | number> & P;
      config?: AxiosRequestConfig;
    }) => {
      let newUrl = baseUrl;
      let body = v?.body;

      // const formData = new FormData(body ?? {});
      // console.log(formData, "FD");
      // const formData = v?.formData
      //   ? getFormData((body as Record<string, string>) ?? {})
      //   : null;

      for (let [key, value] of Object.entries(v?.params ?? {})) {
        newUrl = newUrl.replaceAll(`:${key}`, value.toString());
      }

      for (let [key, value] of Object.entries(v?.params ?? {})) {
        newUrl = newUrl.replaceAll(`:${key}`, value.toString());
      }

      const config: AxiosRequestConfig = {
        ...v?.config,
        headers: {
          ...v?.config?.headers,
        },
      };

      if (v?.formData) {
        config.headers!["Content-Type"] = "multipart/form-data";
      }

      if (["delete"].includes(method)) {
        return request[method](newUrl, {
          ...config,
          data: { ...config.data, ...body },
        })
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data));
      }
      return request[method](newUrl, body, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      if (invalidateTags && invalidateTags(v, d)?.length > 0) {
        invalidateTags(v, d)?.forEach((tag) => {
          queryClient.invalidateQueries({ queryKey: tag });
        });
      }
    },
  });

  return { mutate, mutateAsync, ...rest };
};

// UNSTABLE
export const useOptimistic = <T, P = any, TB = any>({
  method,
  baseUrl,
  optimisticUpdater,
  invalidateTags,
  transformBody,
}: {
  method: MutationMethod;
  baseUrl: string;
  transformBody?: (body: T) => TB;
  invalidateTags?: (v: {
    body?: T;
    formData?: boolean;
    params?: Record<string, string | number> | P;
    config?: AxiosRequestConfig;
  }) => QueryKey[];
  optimisticUpdater: (v: {
    body?: T;
    query?: Record<string, string>;
    formData?: boolean;
    params?: Record<string, string | number> | P;
    config?: AxiosRequestConfig;
  }) => {
    isInfiniteData?: boolean;
    queryKey: QueryKey;
    updater: (oldData: any) => any;
    options?: SetDataOptions | undefined;
  }[];
}) => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: optimistic,
    mutateAsync: optimisticAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      query?: Record<string, string>;
      body?: T;
      formData?: boolean;
      params?: Record<string, string | number>;
      config?: AxiosRequestConfig;
    }) => {
      let body = transformBody ? transformBody(v?.body as T) : v?.body;

      const config: AxiosRequestConfig = {
        ...v?.config,
        headers: {
          ...v?.config?.headers,
        },
      };

      let newUrl = new URL(baseUrl);
      for (let [key, value] of Object.entries(v?.params ?? {})) {
        newUrl.href = newUrl.href.replaceAll(`:${key}`, value.toString());
      }

      for (let [key, value] of Object.entries(v?.query ?? {})) {
        newUrl.searchParams.set(key, value);
      }

      if (v?.formData) {
        config.headers!["Content-Type"] = "multipart/form-data";
      }

      if (["delete"].includes(method)) {
        return request[method](newUrl.href, {
          ...config,
          data: { ...config.data, ...body },
        })
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data));
      }
      return request[method](newUrl.href, body, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onMutate: async (v) => {
      const ctx: { key: QueryKey; data: any }[] = [];

      await Promise.all(
        optimisticUpdater(v).map(async (opt) => {
          await queryClient.cancelQueries(opt.queryKey);
        })
      );

      optimisticUpdater(v).forEach((opt) => {
        ctx.push({
          key: opt.queryKey,
          data: queryClient.getQueryData(opt.queryKey),
        });
        if (opt.isInfiniteData) {
          return (
            queryClient.setQueriesData(opt.queryKey, (old: unknown) =>
              opt.updater(old)
            ),
            opt.options
          );
        }
        queryClient.setQueryData(
          opt.queryKey,
          (old: unknown) => opt.updater(old),
          opt.options
        );
      });

      return ctx;
    },
    onError: (err, v, context) => {
      context?.forEach((ctx) => {
        queryClient.setQueryData(ctx.key, ctx.data);
      });
    },
    onSuccess: (d, v) => {
      if (invalidateTags) {
        invalidateTags(v).forEach((tag) => {
          queryClient.invalidateQueries({ queryKey: tag });
        });
      }
    },
    onSettled: (d, e, v) => {
      optimisticUpdater(v).forEach((opt) => {
        queryClient.invalidateQueries({ queryKey: opt.queryKey });
      });
    },
  });

  return { optimistic, optimisticAsync, ...rest };
};
