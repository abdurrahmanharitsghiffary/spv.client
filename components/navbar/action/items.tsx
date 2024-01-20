import BackButton from "@/components/button/back-button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ChatHeader from "./chat";

export interface NavItem {
  keys?: string[];
  items: (
    router: AppRouterInstance
  ) => { key: string; element: React.ReactNode }[];
  style?: React.CSSProperties | undefined;
  className?: string;
  isShowEndContent?: boolean;
}

export const navItems: NavItem[] = [
  {
    keys: [
      "/group/:groupId",
      "/comments/:commentId",
      "/posts/saved",
      "/posts/:postId",
      "/users/:userId/followers",
      "/users/:userId/following",
      "/chats",
      "/users/blocked",
    ],
    items: (router) => [
      { key: "bck-btn", element: <BackButton router={router} /> },
    ],
  },
  {
    keys: ["/chats/:chatId"],
    items: (router) => [
      { key: "chat-header", element: <ChatHeader router={router} /> },
    ],
    isShowEndContent: false,
  },
  // {
  //   key: "/group/:groupId",
  //   className: "justify-between",
  //   action(router) {
  //     return (
  //       <>
  //         <BackButton router={router} />
  //         <GroupMenuTrigger />
  //       </>
  //     );
  //   },
  // },
];
