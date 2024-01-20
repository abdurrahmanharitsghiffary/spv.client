import { NavbarContent } from "@nextui-org/navbar";
import React from "react";
import { getNavItem } from "./utils";
import { navItems } from "./items";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import clsx from "clsx";

export default function DesktopAction({
  pathname,
  router,
}: {
  router: AppRouterInstance;
  pathname: string;
}) {
  const item = getNavItem(navItems, pathname);
  const items = item?.items(router);

  if (items === null || (items ?? []).length < 1) return null;

  const isSingleItem = (items ?? []).length === 1;

  return (
    <NavbarContent
      justify="start"
      style={{ ...item?.style }}
      className={clsx("items-center px-2 w-full", item?.className)}
    >
      {(items ?? []).length > 0 &&
        (items ?? []).map((item) => (
          <li className={clsx(isSingleItem && "w-full")} key={item.key}>
            {item.element}
          </li>
        ))}
    </NavbarContent>
  );
}
