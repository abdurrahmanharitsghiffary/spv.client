import { CountType, SearchOptions } from "@/types";

export const keys = {
  counts: (type?: CountType[]) => ["counts", type] as const,
  gmr: (type: "all" | "rejected" | "approved" | "pending") =>
    ["membership-requests", "group", type] as const,
  posts: ["posts"] as const,
  meMr: (type: "all" | "rejected" | "approved" | "pending") =>
    [...keys.me, "membership-requests", type] as const,
  users: ["users"] as const,
  myInfo: ["myInfo"] as const,
  post: ["post"] as const,
  me: ["me"] as const,
  comments: ["comments"] as const,
  comment: ["comment"] as const,
  user: ["user"] as const,
  chat: ["chat"] as const,
  messageById: (messageId: number) => ["message", "single", messageId] as const,
  chatByRoomId: (roomId: number) => ["chat", roomId] as const,
  messagebyRoomId: (roomId: number) => ["message", roomId] as const,
  participantByRoomId: (roomId: number) => ["participant", roomId] as const,
  participantByRoomAndParticipantId: (roomId: number, participantId: number) =>
    ["participant", roomId, participantId] as const,
  isFollowing: (userId: number) =>
    [...keys.userById(userId), "isFollow"] as const,
  meAccount: () => [...keys.me, "account"] as const,
  blockedUsers: () => [...keys.users, "blocked"] as const,
  meNotifications: () => [...keys.me, "notifications"] as const,
  meChats: () => [...keys.me, "chats"] as const,
  mePosts: () => [...keys.me, "posts"] as const,
  meFollowers: () => [...keys.me, "followers"] as const,
  meFollowing: () => [...keys.me, "following"] as const,
  search: (options: SearchOptions) => ["search", options] as const,
  commentById: (commentId: number) => [...keys.comment, commentId] as const,
  commentLikes: (commentId: number) =>
    [...keys.commentById(commentId), "likes"] as const,
  commentIsLiked: (commentId: number) =>
    [...keys.commentById(commentId), "isliked"] as const,
  postLikes: (postId: number) => [...keys.postById(postId), "likes"] as const,
  postComments: (postId: number) =>
    [...keys.comment, ...keys.postById(postId)] as const,
  postById: (postId: number) => [...keys.post, postId] as const,
  postByUserId: (userId: number) => [...keys.posts, userId, "users"] as const,
  postIsLiked: (postId: number) =>
    [...keys.postById(postId), "isLiked"] as const,
  postIsSaved: (postId: number) =>
    [...keys.postById(postId), "isSaved"] as const,
  savedPosts: () => [...keys.posts, "saved"] as const,
  followedUsersPost: () => [...keys.posts, "following"] as const,
  userById: (userId: number) => [...keys.user, userId] as const,
  userFollowers: (userId: number) =>
    [...keys.userById(userId), "followers"] as const,
  userFollowedUsers: (userId: number) =>
    [...keys.userById(userId), "following"] as const,
};
