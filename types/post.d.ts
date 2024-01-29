import { Image } from "./profile";
import { UserSimplifiedWF } from "./user";

export type Post = {
  id: number;
  title: string | null;
  content: string;
  images: (Image & { id: number })[] | null;
  author: UserSimplifiedWF;
  total_likes: number;
  createdAt: Date;
  updatedAt: Date;
  total_comments: number;
};

export type PostId = {
  id: number;
  authorId: number;
};
