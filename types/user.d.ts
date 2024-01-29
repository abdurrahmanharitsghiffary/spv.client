import { Image } from "./profile";

export interface UserAccountPublic {
  id: number;
  firstName: string;
  isOnline: boolean;
  lastName: string;
  fullName: string | null;
  username: string;
  profile: {
    birthDate: Date | null;
    gender: "male" | "female" | null;
    description: string | null;
    avatarImage: Image;
    coverImage: Image;
  } | null;
  count: {
    posts: number;
    followedBy: number;
    following: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAccount extends UserAccountPublic {
  email: string;
  provider: "GOOGLE" | null;
  verified: boolean;
  role: "admin" | "user";
}

export interface UserSimplified {
  id: number;
  firstName: string;
  isOnline: boolean;
  fullName: string | null;
  lastName: string;
  username: string;
  avatarImage: Image;
}

export interface UserNotification {
  title: string;
  content: string;
  type:
    | "liking_post"
    | "liking_comment"
    | "comment"
    | "follow"
    | "replying_comment";
  url: string | null;
  createdAt: Date;
}

export interface UserFollowerResponse {
  userId: number;
  followers: UserSimplified[];
  total: number;
}
export type UserGroup = UserSimplified & { role: "admin" | "user" };
export interface UserFollowingResponse {
  userId: number;
  followedUsers: UserSimplified[];
  total: number;
}

export interface UserLike {
  firstName: string;
  lastName: string;
  profilePhoto: Image;
  id: number;
  username: string;
}

export interface UserSimplifiedWF extends UserSimplified {
  isFollowed: boolean;
}

export type SearchFilter = "followed" | "not_followed";
