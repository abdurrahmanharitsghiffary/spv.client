import { Image } from "./profile";
import { UserLike, UserSimplified } from "./user";

interface CommentSimplified {
  id: number;
  postId: number;
  comment: string;
  image: Image;
  user: UserSimplified;
  createdAt: Date;
  updateAt: Date;
  total_likes: number;
}

interface CommentReply extends CommentSimplified {
  commentReply: {
    commentIds: number[];
    total: number;
  };
}

export interface Comment extends CommentSimplified {
  commentReply: {
    commentIds: number[];
    total: number;
  };
}

interface CommentLikeResponse {
  commentId: number;
  likedBy: UserLike[];
  total: number;
}
