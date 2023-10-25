"use client";

import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
import { userById } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { UpdateUserDataOptions } from "@/types";
import { JsendSuccess } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useUpdateUser = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: updateUser,
    mutateAsync: updateUserAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      userId: number;
      data?: UpdateUserDataOptions;
      config?: AxiosRequestConfig;
    }) =>
      request
        .patch(userById(v.userId.toString()), v?.data, v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data)),
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.userById(v.userId) });
    },
  });

  return { updateUser, updateUserAsync, ...rest };
};

export const useDeleteUser = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deleteUser,
    mutateAsync: deleteUserAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { userId: number; config?: AxiosRequestConfig }) =>
      request
        .delete(userById(v.userId.toString()), v?.config)
        .then((res) => res.data as JsendSuccess<null>)
        .catch((err) => Promise.reject(err?.response?.data)),
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({ queryKey: keys.userById(v.userId) });
    },
  });

  return { deleteUser, deleteUserAsync, ...rest };
};
