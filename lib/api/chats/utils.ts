"use client";

import { ChatRoomParticipant } from "@/types/chat";
import { InfiniteData } from "@tanstack/react-query";
import { ApiPagingObjectResponse } from "@/types/response";
type InfiniteParticipantsData = InfiniteData<
  ApiPagingObjectResponse<ChatRoomParticipant[]>
>;

export const getParticipants = (
  oldParticipants: ChatRoomParticipant[],
  newParticipants: ChatRoomParticipant[]
): {
  newParticipants: ChatRoomParticipant[];
  updatedParticipants: ChatRoomParticipant[];
} => {
  const updatedUserIds: number[] = [];

  const participants = oldParticipants.map((user) => {
    let role: "user" | "admin" = "user";
    const currentParticipant = newParticipants.find(
      (participant) => participant.id === user.id
    );

    const isPromotingUserToAdmin =
      user.role === "user" && currentParticipant?.role === "admin";
    const isDemotingAdminToUser =
      user.role === "admin" && currentParticipant?.role === "user";
    const isUserExist = user.role === currentParticipant?.role;

    if (isPromotingUserToAdmin) role = "admin";
    if (isDemotingAdminToUser) role = "user";
    if (isDemotingAdminToUser || isPromotingUserToAdmin)
      updatedUserIds.push(user.id);

    if (currentParticipant && !isUserExist) {
      return {
        ...user,
        role,
      };
    }
    return user;
  });

  const newestParticipants = newParticipants.filter(
    (user) => !updatedUserIds.some((id) => id === user.id)
  );

  return {
    newParticipants: newestParticipants,
    updatedParticipants: participants,
  };
};

export const updateParticipantsData = <OD extends InfiniteParticipantsData>(
  oldData: OD,
  participants: ChatRoomParticipant[]
): OD => {
  const newPages = (oldData?.pages ?? []).map((page, i) => {
    if (!page) return;
    const currParticipants = page?.data;

    const { newParticipants, updatedParticipants } = getParticipants(
      currParticipants,
      participants
    );

    return {
      ...page,
      data: [...newParticipants, ...updatedParticipants],
      pagination: {
        ...page.pagination,
        result_count: page.pagination.result_count + newParticipants.length,
        total_records: page.pagination.total_records + newParticipants.length,
      },
    };
  });

  return {
    ...oldData,
    pages: newPages,
  };
};
