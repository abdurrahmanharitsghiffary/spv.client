import { Image } from "./profile";
import { UserLike, UserSimplifiedWF } from "./user";

export type Post = {
  id: number;
  title: string | null;
  content: string;
  images: (Image & { id: number })[] | null;
  author: UserSimplifiedWF;
  isLiked: boolean;
  isBookmarked: boolean;
  total_likes: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PostExtended = {
  comments: {
    ids: number[];
    total: number;
  };
} & Post;

export type PostLikeResponse = {
  postId: number;
  likedBy: UserLike[];
  total: number;
};

export type PostId = {
  id: number;
  authorId: number;
};
