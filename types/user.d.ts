import { Post } from "./post";
import { Image } from "./profile";

export interface UserAccountPublic {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string | null;
  username: string;
  profile: {
    birthDate: Date | null;
    gender: $Enums.Gender | null;
    description: string | null;
    image: Image;
    coverImage: Image;
  } | null;
  followedBy: {
    followerIds: number[];
    total: number;
  };
  following: {
    followedUserIds: number[];
    total: number;
  };
  posts: {
    postIds: number[];
    total: number;
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

export interface User {
  id: number;
  username: string;
  email: string;
  hashedPassword: string;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
  followedBy: User[];
  following: User[];
  posts: Post[];
}

export interface UserSimplified {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string | null;
  username: string;
  image: Image;
}

export interface UserSimplifiedV2 extends UserSimplified {
  image: Image;
}

export interface UserNotification {
  title: string;
  content: string;
  type: $Enums.NotificationType;
  url: string | null;
  createdAt: Date;
}

export interface UserFollowerResponse {
  userId: number;
  followers: UserSimplifiedV2[];
  total: number;
}

export interface UserFollowingResponse {
  userId: number;
  followedUsers: UserSimplifiedV2[];
  total: number;
}

export interface UserLike {
  firstName: string;
  lastName: string;
  profilePhoto: Image;
  id: number;
  username: string;
}
