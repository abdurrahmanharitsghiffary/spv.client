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
}: {
  queryKey?: QueryKey | undefined;
  query?: Record<string, any>;
  url: string;
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
    queryKey: queryKey,
    queryFn: () =>
      request
        .get(newUrl.href, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data)),
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
    ...rest
  } = useInfiniteQuery<ApiPagingObjectResponse<T[]>>({
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      pageParam === null
        ? Promise.resolve(undefined)
        : request
            .get(pageParam ? pageParam : reqUrl.href, config)
            .then((res) => res.data)
            .catch((err) => Promise.reject(err?.response?.infiniteData)),
    getNextPageParam: (res) => res?.pagination?.next ?? null,
    getPreviousPageParam: (res) => res?.pagination?.previous ?? null,
    ...queryConfig,
  });

  const isFetchNextNotAvailable =
    !isSuccess ||
    (infiniteData?.pageParams ?? []).some((params) => params === null);

  const data = useMemo(
    () => ({
      ...infiniteData?.pages?.[0],
      infiniteData: infiniteData?.pages
        ?.map((page) => (page?.data ?? []).filter((data) => data !== undefined))
        .flat(),
    }),
    [infiniteData]
  );

  return { data, infiniteData, isSuccess, isFetchNextNotAvailable, ...rest };
};

export const useMutate = <T, P = {}>({
  method,
  invalidateTags,
  baseUrl,
}: {
  method: MutationMethod;
  baseUrl: string;
  invalidateTags?: (v: {
    body?: T | undefined;
    formData?: boolean | undefined;
    params?: Record<string, string | number> | undefined;
    config?: AxiosRequestConfig<any> | undefined;
  }) => QueryKey[];
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
      const formData = v?.formData
        ? getFormData((body as Record<string, string>) ?? {})
        : null;

      for (let [key, value] of Object.entries(v?.params ?? {})) {
        console.log(key, value, " k v");
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
          data: formData ? formData : { ...config.data, ...body },
        })
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data));
      }
      return request[method](newUrl, formData ? formData : body, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      if (invalidateTags && invalidateTags(v)?.length > 0) {
        invalidateTags(v)?.forEach((tag) => {
          queryClient.invalidateQueries({ queryKey: tag });
        });
      }
    },
  });

  return { mutate, mutateAsync, ...rest };
};

// UNSTABLE
export const useOptimistic = <T>({
  method,
  baseUrl,
  optimisticUpdater,
  invalidateTags,
}: {
  method: MutationMethod;
  baseUrl: string;
  invalidateTags?: QueryKey[];
  optimisticUpdater: (v: {
    body?: T;
    formData?: boolean;
    params?: Record<string, string | number>;
    config?: AxiosRequestConfig;
  }) => {
    queryKey: QueryKey;
    updater: <S>(oldData: S) => S;
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
      body?: T;
      formData?: boolean;
      params?: Record<string, string | number>;
      config?: AxiosRequestConfig;
    }) => {
      let body = v?.body;
      const formData = v?.formData
        ? getFormData((body as Record<string, string>) ?? {})
        : null;

      const config: AxiosRequestConfig = {
        ...v?.config,
        headers: {
          ...v?.config?.headers,
        },
      };

      let newUrl = baseUrl;
      for (let [key, value] of Object.entries(v?.params ?? {})) {
        console.log(key, value, " k v");
        newUrl = newUrl.replaceAll(`:${key}`, value.toString());
      }

      if (v?.formData) {
        config.headers!["Content-Type"] = "multipart/form-data";
      }

      if (["delete"].includes(method)) {
        return request[method](newUrl, {
          ...config,
          data: formData ? formData : { ...config.data, ...body },
        })
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data));
      }
      return request[method](newUrl, formData ? formData : body, config)
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
      //   queryClient.setQueryData([""], () => {});
      //   queryClient.setQueryData(keys.mePosts(), context?.myPosts);
      //   queryClient.setQueryData(keys.posts, context?.posts);
    },
    onSettled: (d, e, v) => {
      optimisticUpdater(v).forEach((opt) => {
        queryClient.invalidateQueries({ queryKey: opt.queryKey });
      });
      invalidateTags?.forEach((tag) => {
        queryClient.invalidateQueries({ queryKey: tag });
      });
      //   queryClient.invalidateQueries(keys.postById(v.postId));
      //   queryClient.invalidateQueries(keys.posts);
      //   queryClient.invalidateQueries(keys.mePosts());
    },
  });

  return { optimistic, optimisticAsync, ...rest };
};
