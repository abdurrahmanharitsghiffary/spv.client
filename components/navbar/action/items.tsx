import BackButton from "@/components/back-button";
import ChatMenuTrigger from "@/components/menu/chat-menu/trigger";
import ProfileMenuTrigger from "@/components/menu/profile-menu/trigger";
import UserMenuTrigger from "@/components/menu/user-menu/trigger";
import { TypographyLarge, TypographyMuted } from "@/components/ui/typography";
import { Avatar } from "@nextui-org/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

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
    ],
    action: (router) => <BackButton router={router} />,
  },
  {
    key: "null-items",
    keys: ["/search", "/posts"],
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
    action: (router: AppRouterInstance) => (
      <>
        <div
          className="grid grid-flow-row gap-2 items-center w-full"
          style={{
            gridTemplateColumns: "min-content 1fr 1fr",
          }}
        >
          <BackButton router={router} />

          <div className="flex gap-3 items-center">
            <Avatar
              name="John Doe"
              src="https://images.unsplash.com/photo-1695796676535-383805060728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
            />
            <div className="flex flex-col">
              <TypographyLarge className="!text-base">John Doe</TypographyLarge>
              <TypographyMuted className="!text-xs">@johndoe</TypographyMuted>
            </div>
          </div>
          <ChatMenuTrigger className="justify-self-end" />
        </div>
      </>
    ),
  },
];
