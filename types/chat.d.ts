import { Image } from "./profile";
import { UserSimplified } from "./user";

export type Chat = {
  id: number;
  readedBy: UserChatRead[] | null;
  message: string | null;
  attachments: Image[];
  isGroupChat: boolean;
  author: UserSimplified;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserChatRead = UserSimplified & { readedAt: Date };

type ChatRoomParticipant = UserSimplified & {
  role: ParticipantRole;
  joinedAt: Date;
};

type ChatRoom = {
  id: number;
  picture: Image;
  participants: ChatRoomParticipant[];
  totalParticipants: number;
  messages: Chat[];
  totalUnreadMessages: number;
  description?: string | null;
  title?: string | null;
  isGroupChat: boolean;
  createdAt: Date;
  applyType: GroupApplyType;
  groupVisibility: GroupVisibility;
  updatedAt: Date;
};

type GroupApplyType = "public" | "private";
type GroupVisibility = "public" | "private";

export type ParticipantRole = "admin" | "user" | "creator";
