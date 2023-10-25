import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import React from "react";
import { navActionItems } from "./items";
import ChatButton from "@/components/button/chat-button";
import clsx from "clsx";
import { getNavActionItem } from "./utils";
import PreferencesButton from "@/components/button/preferences-button";

export default function NavActions({
  pathname,
  router,
}: {
  pathname: string;
  router: AppRouterInstance;
}) {
  const item = getNavActionItem(navActionItems, pathname);

  if (item?.action === null) return null;

  return (
    <div
      style={item?.style}
      className={clsx(
        "w-full grid px-2 grid-flow-col text-[20px]",
        item ? "content-between" : "content-end",
        item?.className ?? ""
      )}
    >
      {item?.action(router)}
      {!item && (
        <ul className="place-self-end flex gap-2 items-center">
          <li>
            <ChatButton />
          </li>
        </ul>
      )}
    </div>
  );
}
