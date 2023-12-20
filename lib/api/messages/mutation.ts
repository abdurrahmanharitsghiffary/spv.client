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
// type MessageID = InfiniteData<ApiPagingObjectResponse<Chat[]>>;
// export const useCreateMessageOptimistic = () => {
//   const {} = useOptimistic<CreateMessageData>({
//     baseUrl: baseMessageRoutes,
//     method: "post",
//     invalidateTags: (v) => [keys.meChats()],
//     optimisticUpdater(v) {
//         const newMessages = v?.body?.message
//       return [
//         {
//           queryKey: keys.messagebyRoomId(v?.body?.chatRoomId ?? -1),
//           isInfiniteData: true,
//           updater<OD extends MessageID>(oldData: OD): OD {
//             const flattedData = flatInfiniteData(oldData);
//             const latestPage = oldData.pages
//               .filter((p) => p !== undefined)
//               .slice(-1);
//             if (latestPage?.[0]?.data) latestPage[0].data = flattedData;
//             return { ...oldData, pages: latestPage };
//           },
//         },
//       ];
//     },
//   });
// };

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
