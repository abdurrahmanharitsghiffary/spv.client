import { getUrl } from "./getUrl";

export const base = process.env.BASE_API_ROUTE ?? "http://localhost:5000";

export const urlBase = (path: string) => getUrl({ base, path: "/api" + path });
export const constructUrl = (urls: string[]) => urls.join("/");
const entries = (obj?: Record<string, any>) => {
  if (!obj) return undefined;
  return Object.entries(obj).map(([key, value]) => ({ name: key, value }));
};
const withQuerys = (url: string, query?: { name: string; value: any }[]) => {
  let newUrl = url;
  if (query && query.length > 0) {
    newUrl = getUrl({ path: newUrl, query });
  }
  return newUrl;
};

// Auth routes

// Login, SingUp, Logout POST
export const loginRoute = urlBase("/auth/login");
export const signUpRoute = urlBase("/auth/signup");
export const logoutRoute = urlBase("/auth/logout");

// Account routes

// Reset Password POST
export const resetPassword = urlBase("/account/resetpassword");
export const resetPasswordToken = (token: string) =>
  constructUrl([resetPassword, token]);

// Verify account POST
export const verifyAccount = urlBase("/account/verify");
export const verifyAccountToken = (token: string) =>
  constructUrl([verifyAccount, token]);

// User routes
export const baseUserRoutes = (query?: { limit?: number; offset?: number }) =>
  withQuerys(urlBase("/users"), entries(query));
export const blockedUserRoute = (query?: { limit?: number; offset?: number }) =>
  withQuerys(constructUrl([baseUserRoutes(), "blocked"]), entries(query));
export const userById = (userId: string) =>
  constructUrl([baseUserRoutes(), userId]);
export const userPost = (
  userId: string,
  query?: { limit?: number; offset?: number }
) => withQuerys(constructUrl([userById(userId), "posts"]), entries(query));
export const userIsFollowed = (userId: number) =>
  constructUrl([userById(userId.toString()), "followed"]);
export const userFollowersById = (
  userId: string,
  query?: { limit?: number; offset?: number }
) => withQuerys(constructUrl([userById(userId), "followers"]), entries(query));
export const userFollowedUsersById = (
  userId: string,
  query?: { limit?: number; offset?: number }
) => withQuerys(constructUrl([userById(userId), "following"]), entries(query));

// Post routes
export const basePostRoutes = (query?: { limit?: number; offset?: number }) =>
  withQuerys(urlBase("/posts"), entries(query));
export const postById = (postId: string) =>
  constructUrl([basePostRoutes(), postId]);
export const followedUserPost = (query?: { limit?: number; offset?: number }) =>
  withQuerys(constructUrl([basePostRoutes(), "following"]), entries(query));
export const postCommentsByPostId = (
  postId: string,
  query?: {
    order_by?: ("latest" | "oldest" | "highest" | "lowest")[];
    limit?: number;
    offset?: number;
  }
) =>
  withQuerys(
    constructUrl([postById(postId), "comments"]),
    entries({ ...query, order_by: query?.order_by?.join(",") })
  );
export const postLikesByPostId = (
  postId: string,
  query?: { limit?: number; offset?: number }
) => withQuerys(constructUrl([postById(postId), "likes"]), entries(query));
export const postIsLiked = (postId: string) =>
  constructUrl([postById(postId), "liked"]);
export const postImagesByPostId = (postId: string) =>
  constructUrl([postById(postId), "images"]);
export const postImageByPostAndImageId = (postId: string, imageId: string) =>
  constructUrl([postById(postId), "images", imageId]);

// Comment routes
export const baseCommentRoutes = urlBase("/comments");
export const commentById = (commentId: string) =>
  constructUrl([baseCommentRoutes, commentId]);
export const commentLikesById = (
  commentId: string,
  query?: { limit?: number; offset?: number }
) =>
  withQuerys(constructUrl([commentById(commentId), "likes"]), entries(query));

export const commentIsLiked = (commentId: string) =>
  constructUrl([commentById(commentId), "liked"]);

// Logged user routes

export const baseMeRoutes = urlBase("/me");
export const mySavedPostsRoute = (query?: {
  limit?: number;
  offset?: number;
}) =>
  withQuerys(constructUrl([baseMeRoutes, "posts", "saved"]), entries(query));
export const blockUserRoute = constructUrl([baseMeRoutes, "block"]);
export const blockUserByIdRoute = (userId: number) =>
  constructUrl([blockUserRoute, userId.toString()]);
export const mySavedPost = (postId: number) =>
  constructUrl([mySavedPostsRoute(), postId.toString()]);
export const postIsSaved = (postId: number) =>
  constructUrl([mySavedPost(postId), "bookmarked"]);
export const myAccount = constructUrl([baseMeRoutes, "account"]);
export const myAccountImages = constructUrl([myAccount, "images"]);
export const myPosts = (query?: { limit?: number; offset?: number }) =>
  withQuerys(constructUrl([baseMeRoutes, "posts"]), entries(query));
export const myChats = (query?: { limit?: number; offset?: number }) =>
  withQuerys(constructUrl([baseMeRoutes, "chats"]), entries(query));
export const followAccount = constructUrl([baseMeRoutes, "follow"]);
export const followedAccountById = (userId: string) =>
  constructUrl([followAccount, userId]);
export const myFollowers = (query?: { limit?: number; offset?: number }) =>
  withQuerys(constructUrl([baseMeRoutes, "followers"]), entries(query));
export const myFollowedUsers = (query?: { limit?: number; offset?: number }) =>
  withQuerys(constructUrl([baseMeRoutes, "following"]), entries(query));
export const myNotifications = (query?: {
  order_by?: "latest" | "oldest";
  limit?: number;
  offset?: number;
}) => withQuerys(constructUrl([baseMeRoutes, "notifications"]), entries(query));

// Chat routes
export const baseChatRoutes = urlBase("/chats");
export const chatById = (chatId: string) =>
  constructUrl([baseChatRoutes, chatId]);
export const chatsByRecipientId = (
  recipientId: string,
  query?: {
    limit?: number;
    offset?: number;
  }
) =>
  withQuerys(
    constructUrl([baseChatRoutes, "users", recipientId]),
    entries(query)
  );

// Groups Routes
export const baseGroupRoutes = urlBase("/groups");
export const groupById = (groupId: number) =>
  constructUrl([baseGroupRoutes, groupId.toString()]);
export const groupAppReq = (groupId: number) =>
  constructUrl([groupById(groupId), "membership-requests"]);

export const groupApproveOrRejectAppReq = (
  groupId: number,
  userId: number,
  type: "approve" | "reject"
) => constructUrl([groupAppReq(groupId), userId.toString(), type]);

// Search routes
export const searchRoute = (query?: {
  limit?: number;
  offset?: number;
  q?: string;
  type: "user" | "post" | "all" | "group";
}) => withQuerys(urlBase("/search"), entries(query));

// Refresh token route
export const refreshTokenRoute = urlBase("/refresh");

export const baseMessageRoutes = urlBase("/messages");
