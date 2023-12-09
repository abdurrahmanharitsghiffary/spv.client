import BackButton from "@/components/button/back-button";
import SearchButton from "@/components/button/search-button";
import ProfileMenuTrigger from "@/components/menu/profile-menu/trigger";
import UserMenuTrigger from "@/components/menu/user-menu/trigger";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ChatHeader from "./chat";

export interface NavItemsAction {
  keys?: string[];
  key: string;
  action: ((router: AppRouterInstance) => React.JSX.Element) | null;
  style?: React.CSSProperties | undefined;
  className?: string;
}

export const navActionItems: NavItemsAction[] = [
  {
    key: "back-button",
    keys: [
      "/comments/:commentId",
      "/posts/saved",
      "/posts/:postId",
      "/users/:userId/followers",
      "/users/:userId/following",
      "/chats",
      "/users/blocked",
      "group/:groupId",
    ],
    action: (router) => <BackButton router={router} />,
  },
  {
    key: "search-button",
    className: "justify-end",
    keys: ["/menu"],
    action(router) {
      return (
        <>
          <SearchButton />
        </>
      );
    },
  },
  {
    key: "null-items",
    keys: ["/search"],
    action: null,
  },
  {
    key: "/users/:userId",
    className: "justify-between",
    action: (router: AppRouterInstance) => (
      <>
        <BackButton router={router} />
        <UserMenuTrigger />
      </>
    ),
  },
  {
    key: "/profile",
    className: "justify-between",
    action: (router: AppRouterInstance) => (
      <>
        <BackButton router={router} />
        <ProfileMenuTrigger />
      </>
    ),
  },
  {
    key: "/chats/:chatId",
    action: (router: AppRouterInstance) => <ChatHeader router={router} />,
  },
];
