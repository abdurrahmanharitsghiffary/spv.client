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
    baseUrl: baseMessageRoutes,
    method: "post",
    invalidateTags: (v) => [
      //   keys.chatByRoomId(v.body?.chatRoomId ?? -1),
      //   keys.meChats(),
      //   keys.messagebyRoomId(v?.body?.chatRoomId ?? -1),
    ],
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
