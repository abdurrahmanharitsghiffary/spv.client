"use client";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  baseChatRoutes,
  baseCommentRoutes,
  basePostRoutes,
  baseUserRoutes,
  chatById,
  chatsByRecipientId,
  commentById,
  commentLikesById,
  followAccount,
  followedAccountById,
  followedUserPost,
  loginRoute,
  logoutRoute,
  myAccount,
  myAccountImages,
  myChats,
  myFollowedUsers,
  myFollowers,
  myNotifications,
  myPosts,
  postById,
  postCommentsByPostId,
  postImageByPostAndImageId,
  postImagesByPostId,
  postLikesByPostId,
  refreshTokenRoute,
  searchRoute,
  signUpRoute,
  userById,
  userFollowedUsersById,
  userFollowersById,
} from "./endpoints";
import { getFormData } from "./getFormData";
import { getCookie } from "./cookies";

type NotificationType = "post" | "comment" | "follow" | "like";

interface LoginData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterAccountData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface UpdateUserDataOptions {
  username?: string;
  description?: string;
}

interface CreateNotificationData {
  title: string;
  content: string;
  type: NotificationType;
  url?: string;
}

interface CreatePostData {
  title?: string;
  content: string;
  images?: File[];
}

interface UpdatePostDataOptions {
  title?: string;
  content?: string;
  images?: File[];
}

interface CreateCommentData {
  image?: File;
  comment: string;
  postId: number;
  parentId?: number | null;
}

interface CreateChatData {
  recipientId: number;
  message: string;
  image?: File;
}

const axiosWithAccessToken = (accessToken?: string) => {
  const instance = axios;
  return instance.create({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

type OffsetPaging = { limit?: number; offset?: number } | undefined;

type SearchOptions = OffsetPaging & { q?: string; type: "user" | "post" };

type OffsetPagingwithOrder =
  | (OffsetPaging & {
      order_by?: ("latest" | "oldest" | "highest" | "lowest")[];
    })
  | undefined;

interface UserApi {
  getUsers: (
    options?: OffsetPaging,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getUser: (
    userId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  updateUser: (
    userId: number,
    data?: UpdateUserDataOptions,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deleteUser: (
    userId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getUserFollowers: (
    userId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getUserFollowedUsers: (
    userId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
}

interface PostApi {
  getPosts: (
    options?: {
      query?: number;
      limit?: number;
    },
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getPost: (
    postId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  createPost: (
    data: CreatePostData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deletePost: (
    postId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  updatePost: (
    postId: number,
    data: UpdatePostDataOptions,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  likePost: (
    postId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  unlikePost: (
    postId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deleteAllPostImages: (
    postId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deletePostImage: (
    postId: number,
    imageId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
}

interface CommentApi {
  getComment: (
    commentId: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  createComment: (
    data: CreateCommentData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  createReplyComment: (
    commentId: number,
    comment: string,
    image?: File,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  updateComment: (
    commentId: number,
    comment: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deleteComment: (
    commentId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getCommentLikes: (
    commentId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  likeComment: (
    commentId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  unlikeComment: (
    commentId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
}

interface MeApi {
  getMyAccountInfo: (
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  updateMyAccountInfo: (
    data: UpdateUserDataOptions,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deleteMyAccount: (
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deleteMyAccountImage: (
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  updateMyAccountImage: (image: File) => Promise<AxiosResponse<any, any>>;
  getMyChats: (
    query?: OffsetPaging,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getMyPosts: (
    query?: OffsetPaging,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  followAccount: (
    userId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  unfollowAccount: (
    userId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  createNotification: (
    data: CreateNotificationData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getMyFollowers: (
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getMyFollowedUsers: (
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getMyNotifications: (
    query?: OffsetPaging & { order_by?: ("latest" | "oldest")[] },
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  clearMyNotifications: (
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
}

interface ChatApi {
  createChat: (
    data: CreateChatData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  getChatByRecipientId: (
    recipientId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  deleteChat: (
    chatId: number,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  updateChat: (
    chatId: number,
    message: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
}

interface AuthApi {
  login: (
    data: LoginData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  registerAccount: (
    data: RegisterAccountData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any, any>>;
  logout: (config?: AxiosRequestConfig) => Promise<AxiosResponse<any, any>>;
}

export default class SpaceVerseApi
  implements UserApi, PostApi, CommentApi, MeApi, ChatApi, AuthApi
{
  private accessToken: string = "" ?? getCookie("x-spv-access-token") ?? "";

  getUsers(options?: OffsetPaging, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(
      baseUserRoutes(options),
      config
    );
  }

  getUser(userId: number, config?: AxiosRequestConfig) {
    return axios.get(userById(userId.toString()), config);
  }

  updateUser(
    userId: number,
    data?: UpdateUserDataOptions,
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).patch(
      userById(userId.toString()),
      data,
      config
    );
  }

  deleteUser(userId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      userById(userId.toString()),
      config
    );
  }

  getUserFollowers(userId: number, config?: AxiosRequestConfig) {
    return axios.get(userFollowersById(userId.toString()), config);
  }

  getUserFollowedUsers(userId: number, config?: AxiosRequestConfig) {
    return axios.get(userFollowedUsersById(userId.toString()), config);
  }

  getPosts(options?: OffsetPaging, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(
      basePostRoutes(options),
      config
    );
  }

  getPost(postId: number, config?: AxiosRequestConfig) {
    return axios.get(postById(postId.toString()), config);
  }

  getPostFromFollowerUsers(
    options?: OffsetPaging,
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).get(
      followedUserPost(options),
      config
    );
  }

  getPostCommentByPostId(
    postId: number,
    options: OffsetPagingwithOrder,
    config?: AxiosRequestConfig
  ) {
    return axios.get(postCommentsByPostId(postId.toString(), options), config);
  }

  getPostLikeByPostId(postId: number, config?: AxiosRequestConfig) {
    return axios.get(postLikesByPostId(postId.toString()), config);
  }

  createPost(data: CreatePostData, config?: AxiosRequestConfig) {
    const formData = new FormData();
    if (data?.title) formData.append("title", data?.title);
    formData.append("content", data?.content);
    if (data?.images && data?.images?.length > 0) {
      data.images.forEach((image) => formData.append("images", image));
    }
    return axiosWithAccessToken(this.accessToken).post(
      basePostRoutes(),
      formData,
      config
    );
  }

  updatePost(
    postId: number,
    data: UpdatePostDataOptions,
    config?: AxiosRequestConfig
  ) {
    const formData = getFormData(data);

    return axiosWithAccessToken(this.accessToken).patch(
      postById(postId.toString()),
      formData,
      config
    );
  }

  deletePost(postId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      postById(postId.toString()),
      config
    );
  }

  likePost(postId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).post(
      postLikesByPostId(postId.toString()),
      config
    );
  }

  unlikePost(postId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      postLikesByPostId(postId.toString()),
      config
    );
  }

  deleteAllPostImages(postId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      postImagesByPostId(postId.toString()),
      config
    );
  }

  deletePostImage(
    postId: number,
    imageId: number,
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).delete(
      postImageByPostAndImageId(postId.toString(), imageId.toString()),
      config
    );
  }

  createComment(data: CreateCommentData, config?: AxiosRequestConfig) {
    const formData = new FormData();

    if (data?.image) formData.append("image", data.image);
    if (data?.parentId) formData.append("parentId", data.parentId.toString());
    formData.append("comment", data.comment);
    formData.append("postId", data.postId.toString());

    return axiosWithAccessToken(this.accessToken).post(
      baseCommentRoutes,
      formData,
      config
    );
  }

  createReplyComment(
    commentId: number,
    comment: string,
    image?: File,
    config?: AxiosRequestConfig
  ) {
    const formData = new FormData();
    formData.append("commentId", commentId.toString());
    formData.append("comment", comment);
    if (image) formData.append("image", image);

    return axiosWithAccessToken(this.accessToken).post(
      commentById(commentId.toString()),
      formData,
      config
    );
  }

  getComment(commentId: string, config?: AxiosRequestConfig) {
    return axios.get(commentById(commentId.toString()), config);
  }

  getCommentLikes(commentId: number, config?: AxiosRequestConfig) {
    return axios.get(commentLikesById(commentId.toString()), config);
  }

  deleteComment(commentId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      commentById(commentId.toString()),
      config
    );
  }

  likeComment(commentId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).post(
      commentLikesById(commentId.toString()),
      config
    );
  }

  unlikeComment(commentId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      commentLikesById(commentId.toString()),
      config
    );
  }

  updateComment(
    commentId: number,
    comment: string,
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).patch(
      commentById(commentId.toString()),
      { comment },
      config
    );
  }

  getMyAccountInfo(config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(myAccount, config);
  }

  getMyChats(query?: OffsetPaging, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(myChats(query), config);
  }
  getMyPosts(query?: OffsetPaging, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(myPosts(query), config);
  }
  getMyFollowers(config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(myFollowers, config);
  }
  getMyFollowedUsers(config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(myFollowedUsers, config);
  }
  getMyNotifications(
    query?: OffsetPaging & { order_by?: ("latest" | "oldest")[] },
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).get(
      myNotifications(query),
      config
    );
  }

  updateMyAccountInfo(
    data: UpdateUserDataOptions,
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).patch(
      myAccount,
      data,
      config
    );
  }

  updateMyAccountImage(image: File, config?: AxiosRequestConfig) {
    const formData = new FormData();
    formData.append("image", image);
    return axiosWithAccessToken(this.accessToken).patch(
      myAccountImages,
      formData,
      config
    );
  }

  deleteMyAccountImage(config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      myAccountImages,
      config
    );
  }

  deleteMyAccount(config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(myAccount, config);
  }

  followAccount(userId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).post(
      followAccount,
      {
        userId,
      },
      config
    );
  }

  unfollowAccount(userId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      followedAccountById(userId.toString()),
      config
    );
  }

  createNotification(
    data: CreateNotificationData,
    config?: AxiosRequestConfig
  ) {
    return axiosWithAccessToken(this.accessToken).post(
      myNotifications(),
      data,
      config
    );
  }

  clearMyNotifications(config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      myNotifications(),
      config
    );
  }

  search(options: SearchOptions, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(
      searchRoute(options),
      config
    );
  }

  createChat(data: CreateChatData, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).post(
      baseChatRoutes,
      data,
      config
    );
  }
  deleteChat(chatId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).delete(
      chatById(chatId.toString()),
      config
    );
  }
  getChatByRecipientId(recipientId: number, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).get(
      chatsByRecipientId(recipientId.toString()),
      config
    );
  }
  updateChat(chatId: number, message: string, config?: AxiosRequestConfig) {
    return axiosWithAccessToken(this.accessToken).patch(
      chatById(chatId.toString()),
      { message },
      config
    );
  }

  login(data: LoginData, config?: AxiosRequestConfig) {
    return axios.post(loginRoute, data, { withCredentials: true, ...config });
  }

  registerAccount(data: RegisterAccountData, config?: AxiosRequestConfig) {
    return axios.post(signUpRoute, data, { withCredentials: true, ...config });
  }

  // NEED FIX
  logout(config?: AxiosRequestConfig) {
    return axios.post(logoutRoute, null, { withCredentials: true, ...config });
  }

  refreshAccessToken(config?: AxiosRequestConfig) {
    return axios.post(
      refreshTokenRoute,
      {},
      {
        ...config,
        withCredentials: true,
      }
    );
  }

  setAccessToken(accessToken: string) {
    this.setToken = accessToken;
  }

  private set setToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  get getAccessToken() {
    return this.accessToken;
  }
}

// const spaceVerseApi = new SpaceVerseApi();

// spaceVerseApi.setAccessToken(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQWJkdXJyYWhtYW4iLCJsYXN0TmFtZSI6Ikhhcml0cyIsImVtYWlsIjoiYWJkbWFuaGFyaXRzQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYWJkaGcxMjQiLCJpYXQiOjE2OTY0OTE1MTcsImV4cCI6MTY5NjQ5NTExN30.JVvMKeIGM22gpFVLTDi-sOYURHIbOX709V5bAZO7744"
// );
// spaceVerseApi.login({
//   email: "abdmanharits@gmail.com",
//   password: "yahahawahyoee",
//   confirmPassword: "yahahawahyoee",
// });
// console.log(spaceVerseApi.getAccessToken, "ct");
// spaceVerseApi.getMyPosts().then((res) => console.log(res.data));
// spaceVerseApi
//   .search({ type: "post", offset: 38 })
//   .then((res) => console.log(res.data));
// spaceVerseApi.search({ type: "user" }).then((res) => console.log(res.data));
// spaceVerseApi.getMyAccountInfo().then((res) => console.log(res.data));
