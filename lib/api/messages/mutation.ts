"use client";

import { baseMessageRoutes } from "@/lib/endpoints";
import { useMutate } from "../hooks";
import { CreateMessageData } from "@/types";

export const useCreateMessage = () => {
  const {
    mutate: createMessage,
    mutateAsync: createMessageAsync,
    ...rest
  } = useMutate<CreateMessageData>({
    method: "post",
    baseUrl: baseMessageRoutes,
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
