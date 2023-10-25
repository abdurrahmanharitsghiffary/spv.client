import { Image } from "./profile";
import { UserLike, UserSimplified } from "./user";

export type Post = {
  id: number;
  title: string | null;
  content: string;
  images: (Image & { id: number })[] | null;
  author: UserSimplified;
  total_likes: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PostExtended = {
  comments: {
    commentIds: number[];
    total: number;
  };
} & Post;

export type PostLikeResponse = {
  postId: number;
  likedBy: UserLike[];
  total: number;
};
