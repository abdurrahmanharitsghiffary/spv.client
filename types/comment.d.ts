import { Image } from "./profile";
import { UserLike, UserSimplifiedWF } from "./user";

interface CommentSimplified {
  id: number;
  postId: number;
  comment: string;
  image: Image;
  user: UserSimplifiedWF;
  createdAt: Date;
  updatedAt: Date;
  totalLikes: number;
}

export interface Comment extends CommentSimplified {
  replies: number[];
  totalReplies: number;
}

interface CommentLikeResponse {
  commentId: number;
  likedBy: UserLike[];
  total: number;
}

export type CommentId = {
  id: number;
  authorId: number;
} | null;
