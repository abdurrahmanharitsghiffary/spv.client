"use client";
import { InfiniteData } from "@tanstack/react-query";
import { baseChatRoutes } from "@/lib/endpoints";
import { useMutate, useOptimistic } from "../hooks";
import { keys } from "@/lib/queryKey";
import { ParticipantsField } from "@/types";
import { ChatRoom, ChatRoomParticipant } from "@/types/chat";
import { ApiPagingObjectResponse, ApiResponseT } from "@/types/response";
import { getParticipants, updateParticipantsData } from "./utils";

export const useCreateChatRoom = () => {
  const {
    mutate: createChatRoom,
    mutateAsync: createChatRoomAsync,
    ...rest
  } = useMutate<{ participantId: number }>({
    baseUrl: baseChatRoutes,
    method: "post",
  });

  return { createChatRoom, createChatRoomAsync, ...rest };
};

// export const useCreateChatRoomOptimistic = () => {
//   const {} = useOptimistic<{user:UserSimplified}>({baseUrl:baseChatRoutes, method:"post", optimisticUpdater(v) {
//     return [{
//       queryKey:keys.meChats(),
//       isInfiniteData:true,
//       updater<OD extends InfiniteData<ApiPagingObjectResponse<ChatRoom[]>>>(oldData:OD):OD {
//         if(!oldData) return oldData
//         return {...oldData, pages:oldData.pages.map(page => {
//           page.
//         })}
//       },
//     }]
//   },})

// }

export const useCreateGroupChat = () => {
  const {
    mutate: createGroupChat,
    mutateAsync: createGroupChatAsync,
    ...rest
  } = useMutate<{
    participants: ParticipantsField[];
    title?: string;
    description?: string;
    image: File;
  }>({
    baseUrl: baseChatRoutes + "/group",
    method: "post",
  });

  return { createGroupChat, createGroupChatAsync, ...rest };
};
type UpdateGroupOptions = {
  participants?: ParticipantsField[];
  title?: string;
  description?: string;
  image?: File;
};

type UpdateGroupParams = { groupId: number };
export const useUpdateGroupChat = () => {
  const {
    mutate: updateGroupChat,
    mutateAsync: updateGroupChatAsync,
    ...rest
  } = useMutate<UpdateGroupOptions, UpdateGroupParams>({
    baseUrl: baseChatRoutes + "/group/:groupId",
    method: "patch",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.groupId)),
      keys.chatByRoomId(Number(v.params?.groupId)),
    ],
  });
  return { updateGroupChat, updateGroupChatAsync, ...rest };
};

export const useDeleteGroupChat = () => {
  const {
    mutate: deleteGroupChat,
    mutateAsync: deleteGroupChatAsync,
    ...rest
  } = useMutate<undefined, { groupId: number }>({
    baseUrl: baseChatRoutes + "/group/:groupId",
    method: "delete",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.chatByRoomId(Number(v.params?.groupId)),
    ],
  });
  return { deleteGroupChat, deleteGroupChatAsync, ...rest };
};

export const useJoinGroupChat = () => {
  const {
    mutate: joinGroupChat,
    mutateAsync: joinGroupChatAsync,
    ...rest
  } = useMutate<undefined, { groupId: number }>({
    baseUrl: baseChatRoutes + "/group/:groupId/join",
    method: "post",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.groupId)),
      keys.chatByRoomId(Number(v.params?.groupId)),
    ],
  });

  return { joinGroupChat, joinGroupChatAsync, ...rest };
};

export const useJoinGroupChatOptimistic = () => {
  const {
    optimistic: joinGroup,
    optimisticAsync: joinGroupAsync,
    ...rest
  } = useOptimistic<
    { user: ChatRoomParticipant },
    { groupId: string | number },
    undefined
  >({
    baseUrl: baseChatRoutes + "/group/:groupId/join",
    transformBody: () => undefined,
    method: "post",
    invalidateTags: (v) => [keys.meChats()],
    optimisticUpdater(v) {
      const user = v.body?.user;
      return [
        {
          queryKey: keys.chatByRoomId(Number(v.params?.groupId)),
          updater<OD extends ApiResponseT<ChatRoom>>(oldData: OD): OD {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                participants: {
                  users: [user, ...oldData?.data?.participants?.users],
                  total: oldData.data.participants.total + 1,
                },
              },
            };
          },
        },
        {
          isInfiniteData: true,
          queryKey: keys.participantByRoomId(Number(v?.params?.groupId)),
          updater<OD extends InfiniteParticipantsData>(oldData: OD): OD {
            if (!oldData) return undefined as any;
            const pages = (oldData?.pages ?? []).filter((p) => p !== undefined);
            const pg = pages.map((p) => p.data).flat();
            const newPages = pages.slice(-1).map((p) => ({
              ...p,
              data: [user, ...pg],
              pagination: {
                ...p?.pagination,
                result_count: p?.pagination?.result_count + 1,
                total_records: p?.pagination?.total_records + 1,
              },
            }));
            return { ...oldData, pages: newPages };
          },
        },
      ];
    },
  });

  return { joinGroup, joinGroupAsync, ...rest };
};

export const useLeaveGroupChat = () => {
  const {
    mutate: leaveGroupChat,
    mutateAsync: leaveGroupChatAsync,
    ...rest
  } = useMutate<undefined, { groupId: number }>({
    baseUrl: baseChatRoutes + "/group/:groupId/leave",
    method: "delete",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.groupId)),
      keys.chatByRoomId(Number(v.params?.groupId)),
    ],
  });

  return { leaveGroupChat, leaveGroupChatAsync, ...rest };
};

export const useLeaveGroupChatOptimistic = () => {
  const {
    optimistic: leaveGroup,
    optimisticAsync: leaveGroupAsync,
    ...rest
  } = useOptimistic<
    { userId: number },
    { groupId: number | string },
    undefined
  >({
    baseUrl: baseChatRoutes + "/group/:groupId/leave",
    method: "delete",
    transformBody: () => undefined,
    invalidateTags: (v) => [keys.meChats()],
    optimisticUpdater(v) {
      const gId = Number(v?.params?.groupId);
      return [
        {
          queryKey: keys.chatByRoomId(gId),
          updater<OD extends ApiResponseT<ChatRoom>>(oldData: OD): OD {
            return {
              ...oldData,
              data: {
                ...oldData?.data,
                participants: {
                  users: oldData?.data?.participants?.users?.filter(
                    (user) => user.id !== v.body?.userId
                  ),
                  total: oldData?.data?.participants?.total - 1,
                },
              },
            };
          },
        },
        {
          queryKey: keys.participantByRoomId(gId),
          updater<OD extends InfiniteParticipantsData>(oldData: OD): OD {
            const id = v?.body?.userId;
            return {
              ...oldData,
              pages: (oldData?.pages ?? []).map((page) => ({
                ...page,
                data: (page?.data ?? []).filter((item) => id !== item.id),
                pagination: {
                  ...page?.pagination,
                  total_records: (page?.pagination?.total_records ?? 0) - 1,
                },
              })),
            };
          },
          isInfiniteData: true,
        },
      ];
    },
  });

  return { leaveGroup, leaveGroupAsync, ...rest };
};

type AddParticipantsOptions = { participants: ParticipantsField[] };
type AddParticipantsParams = { roomId: string | number };
export const useAddGroupParticipants = () => {
  const {
    mutate: addParticipants,
    mutateAsync: addParticipantsAsync,
    ...rest
  } = useMutate<AddParticipantsOptions, AddParticipantsParams>({
    baseUrl: baseChatRoutes + "/:roomId/participants",
    method: "patch",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.roomId)),
      keys.chatByRoomId(Number(v.params?.roomId)),
    ],
  });

  return { addParticipants, addParticipantsAsync, ...rest };
};

export const useRemoveParticipants = () => {
  const {
    mutate: removeParticipants,
    mutateAsync: removeParticipantsAsync,
    ...rest
  } = useMutate<{ ids: number[] }, { roomId: number }>({
    baseUrl: baseChatRoutes + "/:roomId/participants",
    method: "delete",
    invalidateTags: (v) => [
      keys.meChats(),
      keys.participantByRoomId(Number(v.params?.roomId)),
      keys.chatByRoomId(Number(v.params?.roomId)),
    ],
  });

  return { removeParticipants, removeParticipantsAsync, ...rest };
};
type InfiniteParticipantsData = InfiniteData<
  ApiPagingObjectResponse<ChatRoomParticipant[]>
>;

export const useAddGroupParticipantsOptimistic = () => {
  const {
    optimistic: addGroupParticipants,
    optimisticAsync: addGroupParticipantsAsync,
    ...rest
  } = useOptimistic<
    {
      participants: (ChatRoomParticipant & {
        role: ParticipantsField["role"];
      })[];
    },
    AddParticipantsParams,
    { participants: ParticipantsField[] }
  >({
    method: "patch",
    baseUrl: baseChatRoutes + "/:roomId/participants",
    transformBody: (body) => ({
      participants: body.participants.map((participant) => ({
        role: participant.role,
        id: participant.id,
      })),
    }),
    optimisticUpdater: (v) => [
      {
        queryKey: keys.chatByRoomId(Number(v.params?.roomId)),
        updater<OD extends ApiResponseT<ChatRoom>>(oldData: OD): OD {
          const { newParticipants, updatedParticipants } = getParticipants(
            oldData.data.participants.users,
            v?.body?.participants ?? []
          );
          return {
            ...oldData,
            data: {
              ...oldData.data,
              participants: {
                users: [...newParticipants, ...updatedParticipants],
                total: oldData.data.participants.total + newParticipants.length,
              },
            },
          };
        },
      },
      {
        isInfiniteData: true,
        queryKey: keys.participantByRoomId(Number(v?.params?.roomId)),
        updater<OD extends InfiniteParticipantsData>(oldData: OD): OD {
          if (!oldData) return undefined as any;
          return updateParticipantsData(oldData, v?.body?.participants ?? []);
        },
      },
    ],
    invalidateTags: (v) => [keys.meChats()],
  });

  return {
    addGroupParticipants,
    addGroupParticipantsAsync,
    ...rest,
  };
};
export const useRemoveParticipantsOptimistic = () => {
  const {
    optimistic: removeParticipants,
    optimisticAsync: removeParticipantsAsync,
    ...rest
  } = useOptimistic<{ ids: number[] }, { roomId: number }>({
    baseUrl: baseChatRoutes + "/:roomId/participants",
    method: "delete",
    invalidateTags: (v) => [keys.meChats()],
    optimisticUpdater: (v) => [
      {
        queryKey: keys.participantByRoomId(Number(v?.params?.roomId)),
        updater<OD extends InfiniteParticipantsData>(oldData: OD): OD {
          const ids = v?.body?.ids ?? [];
          return {
            ...oldData,
            pages: (oldData?.pages ?? []).map((page) => ({
              ...page,
              data: (page?.data ?? []).filter(
                (item) => !ids.some((id) => id === item.id)
              ),
              pagination: {
                ...page?.pagination,
                total_records:
                  (page?.pagination?.total_records ?? 0) - ids.length,
              },
            })),
          };
        },
        isInfiniteData: true,
      },
      {
        queryKey: keys.chatByRoomId(Number(v?.params?.roomId)),
        updater<OD extends ApiResponseT<ChatRoom>>(oldData: OD): OD {
          const ids = v?.body?.ids ?? [];

          return {
            ...oldData,
            data: {
              ...oldData?.data,
              participants: {
                ...oldData?.data?.participants,
                total: (oldData?.data?.participants?.total ?? 0) - ids.length,
                users: (oldData?.data?.participants?.users ?? []).filter(
                  (user) => !ids.some((id) => id === user.id)
                ),
              },
            },
          };
        },
      },
    ],
  });

  return { removeParticipants, removeParticipantsAsync, ...rest };
};

export const useUpdateGroupChatOptimistic = () => {
  const {
    optimistic: updateGroupChat,
    optimisticAsync: updateGroupChatAsync,
    ...rest
  } = useOptimistic<
    UpdateGroupOptions & { participants: ChatRoomParticipant[] },
    UpdateGroupParams,
    UpdateGroupOptions
  >({
    baseUrl: baseChatRoutes + "/group/:groupId",
    method: "patch",
    invalidateTags: (v) => [keys.meChats()],
    optimisticUpdater: (v) => [
      {
        queryKey: keys.participantByRoomId(Number(v.params?.groupId)),
        isInfiniteData: true,
        updater<OD extends InfiniteParticipantsData>(oldData: OD): OD {
          const participants = v.body?.participants ?? [];

          if (participants.length === 0) return oldData;
          return updateParticipantsData(oldData, participants);
        },
      },
      {
        queryKey: keys.chatByRoomId(Number(v?.params?.groupId)),
        updater<OD extends ApiResponseT<ChatRoom>>(oldData: OD): OD {
          const body = v?.body;
          const participants = body?.participants ?? [];
          const newData = oldData?.data;
          if (body?.description) newData.description = body.description;
          if (body?.title) newData.title = body.title;
          if (body?.image)
            newData.picture = { src: URL.createObjectURL(body.image) };
          if (participants.length > 0) {
            const { newParticipants, updatedParticipants } = getParticipants(
              newData.participants.users,
              participants
            );

            newData.participants = {
              users: [...newParticipants, ...updatedParticipants],
              total: oldData.data.participants.total + newParticipants.length,
            };
          }
          return {
            ...oldData,
            data: {
              ...oldData?.data,
              ...newData,
            },
          };
        },
      },
    ],
    transformBody: (b) => ({
      ...b,
      participants: (b.participants ?? []).map((participant) => ({
        id: participant.id,
        role: participant.role,
      })),
    }),
  });

  return { updateGroupChat, updateGroupChatAsync, ...rest };
};
