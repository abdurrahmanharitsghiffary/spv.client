import { SVGProps } from "react";
import { Post, PostExtended } from "./post";
import { UserAccountPublic } from "./user";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type DisclosureMinified = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type Disclosure = {
  onOpenChange: () => void;
  isControlled: boolean;
  getButtonProps: (props?: any) => any;
  getDisclosureProps: (props?: any) => any;
} & DisclosureMinified;

export type NotificationType =
  | "post"
  | "comment"
  | "like_post"
  | "like_comment"
  | "follow"
  | "reply_comment";

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

export interface CreateChatData {
  recipientId: number;
  message: string;
  image?: File;
}

export type OffsetPaging = { limit?: number; offset?: number } | undefined;

export type SearchOptions = OffsetPaging & {
  q?: string;
  type: "user" | "post" | "all";
};

export type OffsetPagingwithOrder =
  | (OffsetPaging & {
      order_by?: ("latest" | "oldest" | "highest" | "lowest")[];
    })
  | undefined;

export type PaginationData<T> = { data: T; total: number };
export type SearchAllData = {
  posts: PaginationData<PostExtended[]>;
  users: PaginationData<UserAccountPublic[]>;
};
