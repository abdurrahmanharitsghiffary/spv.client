"use client";

import { baseMessageRoutes } from "@/lib/endpoints";
import { useMutate } from "../hooks";
import { CreateMessageData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { getFormData } from "@/lib/getFormData";
import { AxiosRequestConfig } from "axios";

export const useCreateMessage = () => {
  const req = useAxiosInterceptor();

  const {
    mutate: createMessage,
    mutateAsync: createMessageAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      data: CreateMessageData;
      config?: AxiosRequestConfig;
    }) => {
      const formData = getFormData(v.data);
      return req
        .post(baseMessageRoutes, formData)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
  });

  return { createMessage, createMessageAsync, ...rest };
};

export const useDeleteMessage = () => {
  const {
    mutate: deleteMessage,
    mutateAsync: deleteMessageAsync,
    ...rest
  } = useMutate<undefined, { messageId: number }>({
    baseUrl: baseMessageRoutes + "/:messageId",
    method: "delete",
  });

  return { deleteMessage, deleteMessageAsync, ...rest };
};

export const useEditMessage = () => {
  const {
    mutate: editMessage,
    mutateAsync: editMessageAsync,
    ...rest
  } = useMutate<{ message: string }, { messageId: number }>({
    baseUrl: baseMessageRoutes + "/:messageId",
    method: "patch",
  });

  return { editMessage, editMessageAsync, ...rest };
};
