import { UserSimplified } from "./user";

type BaseNotification = {
  senderId: number;
  receiverId: number;
  sender: UserSimplified;
  receiver: UserSimplified;
  isRead: boolean;
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

type BaseCommentNotification = { commentId: number; postId: number };
type LikingPost = { type: "liking_post"; postId: number };
type ReplyingComment = { type: "replying_comment" } & BaseCommentNotification;
type CommentingPost = { type: "comment" } & BaseCommentNotification;
type LikingComment = { type: "liking_comment" } & BaseCommentNotification;
type FollowingUser = { type: "follow" };
type ApRq = {
  type: "rejected_group_application" | "accepted_group_application";
} & { groupId: number };

export type Notification = (
  | LikingComment
  | ReplyingComment
  | CommentingPost
  | LikingPost
  | FollowingUser
  | ApRq
) &
  BaseNotification;
