import { ChatRoom, ChatRoomParticipant } from "@/types/chat";

export const getGroupChatTitle = (
  chatRoom: ChatRoom | undefined,
  sessionId: number
) => {
  const IS_GROUP_CHAT = chatRoom?.isGroupChat ?? false;
  const filteredUser: any = IS_GROUP_CHAT
    ? []
    : (chatRoom?.participants?.users ?? []).filter(
        (user) => user.id !== sessionId
      )?.[0];

  if (IS_GROUP_CHAT) {
    return chatRoom?.title ?? `Group chat ${chatRoom?.id}`;
  }
  return `${filteredUser?.fullName} (${filteredUser?.username})`;
};
