import { Image } from "./profile";
import { UserSimplifiedWF } from "./user";

export type Post = {
  id: number;
  title: string | null;
  content: string;
  images: (Image & { id: number })[] | null;
  author: UserSimplifiedWF;
  totalLikes: number;
  createdAt: Date;
  updatedAt: Date;
  totalComments: number;
};

export type PostId = {
  id: number;
  authorId: number;
};
