"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { myNotifications } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { CreateNotificationData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useCreateNotification = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: createNotification,
    mutateAsync: createNotificationAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      data: CreateNotificationData;
      config?: AxiosRequestConfig;
    }) => {
      return request
        .post(myNotifications(), v.data, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: keys.meNotifications(),
      });
    },
  });

  return { createNotification, createNotificationAsync, ...rest };
};
