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

type ChatRoomSimplified = {
  id: number;
  picture: Image;
  totalParticipants: number;
  description?: string | null;
  title?: string | null;
  isGroupChat: boolean;
  createdAt: Date;
  applyType: GroupApplyType;
  groupVisibility: GroupVisibility;
  updatedAt: Date;
};

type ChatRoom = {
  participants: ChatRoomParticipant[];
  messages: Chat[];
  totalUnreadMessages: number;
} & ChatRoomSimplified;

type GroupApplyType = "public" | "private";
type GroupVisibility = "public" | "private";

export type ParticipantRole = "admin" | "user" | "creator" | "co_creator";
