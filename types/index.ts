import { SVGProps } from "react";
import { Post } from "./post";
import { UserAccountPublic } from "./user";
import { ChatRoom, ChatRoomParticipant } from "./chat";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type DisclosureMinified = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type DisclosureStoreMinified = {
  isOpen: DisclosureMinified["isOpen"];
  actions: {
    onOpen: DisclosureMinified["onOpen"];
    onClose: DisclosureMinified["onClose"];
  };
};

export type Disclosure = {
  onOpenChange: () => void;
  isControlled: boolean;
  getButtonProps: (props?: any) => any;
  getDisclosureProps: (props?: any) => any;
} & DisclosureMinified;

export type NotificationType =
  | "liking_post"
  | "liking_comment"
  | "comment"
  | "follow"
  | "replying_comment";

export type LoginData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type ApiNotificationType = "post" | "comment" | "follow" | "like";

export interface RegisterAccountData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDataOptions {
  username?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  gender?: Gender;
}

export interface CreateNotificationData {
  title: string;
  content: string;
  type: NotificationType;
  url?: string;
}

export interface CreatePostData {
  title?: string;
  content: string;
  images?: File[];
}

export interface UpdatePostDataOptions {
  title?: string;
  content?: string;
  images?: File[];
}

export interface CreateCommentData {
  image?: File;
  comment: string;
  postId: number;
  parentId?: number | null;
  imageSrc?: string;
}

export interface CreateMessageData {
  chatRoomId: number;
  message?: string;
  images?: File[];
}
export type Key = string | number;
export type OffsetPaging = { limit?: number; offset?: number } | undefined;

export type SearchOptions = OffsetPaging & {
  q?: string;
  type: "user" | "post" | "all";
  filter?: "followed" | "not_followed";
};

export type OffsetPagingwithOrder =
  | (OffsetPaging & {
      order_by?: ("latest" | "oldest" | "highest" | "lowest")[];
    })
  | undefined;

export type PaginationData<T> = { data: T; total: number };
export type SearchAllData = {
  posts: PaginationData<Post[]>;
  users: PaginationData<UserAccountPublic[]>;
};

export type Gender = "male" | "female" | "not_say" | null;

export type ParticipantsField = { role: "user" | "admin"; id: number };

type URP = {
  updating: "participants";
  roomId: number;
  data: ChatRoomParticipant[];
};

type URD = {
  updating: "details";
  data: ChatRoom;
};

type URDEL = {
  updating: "delete-participants";
  roomId: number;
  data: number[];
};

export type ParticipantsData = {
  roomId: number;
  data: ChatRoomParticipant[];
};

export type DeleteParticipantsData = {
  roomId: number;
  data: number[];
};

export type UpdateRoom = URD;

export type TypingUser = {
  chatId: number;
  userId: number;
  fullName: string;
  username: string;
} | null;

export type TypingUserV2 = {
  chatId: number;
  userId: number;
  fullName: string;
  username: string;
};

export type Counts = {
  readedMessages?: number;
  readedNotifications?: number;
  likedPosts?: number;
  likedComments?: number;
  unreadMessages?: number;
  unreadNotifications?: number;
  notifications?: number;
  messages?: number;
  posts?: number;
  savedPosts?: number;
  followers?: number;
  followedUsers?: number;
  blockedUsers?: number;
  chatRooms?: number;
  participatedGroups?: number;
  comments?: number;
};

export type CountType =
  | "readed_messages"
  | "readed_notifications"
  | "liked_posts"
  | "liked_comments"
  | "unread_messages"
  | "unread_notifications"
  | "notifications"
  | "messages"
  | "posts"
  | "saved_posts"
  | "followers"
  | "followed_users"
  | "blocked_users"
  | "chat_rooms"
  | "participated_groups"
  | "comments";
