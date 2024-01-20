import { Suspense, useEffect, useState } from "react";
import Search from "../search";
import ChatButton from "../button/chat-button";
import UserAvatar from "./user-avatar";
import { NavbarContent } from "@nextui-org/navbar";
import { getNavItem } from "./action/utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { navItems } from "./action/items";
import { useIsMd } from "@/hooks/use-media-query";
import IconButton from "../button/icon-button";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import clsx from "clsx";

export default function NavEndContent({
  pathname,
  router,
}: {
  pathname: string;
  router: AppRouterInstance;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const item = getNavItem(navItems, pathname);
  const items = item?.items(router);
  const isMd = useIsMd();

  const isShowEndContent = item?.isShowEndContent ?? true;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (items === null || !isMounted || !isShowEndContent) return null;

  const isShowSearchBar = !pathname.includes("/search") || !isMd;
  const isShowButtonSearch =
    !pathname.includes("/search") && !isMd && (items ?? []).length > 0;
  return (
    <NavbarContent
      justify="end"
      className={clsx(
        "w-full md:w-auto md:justify-end gap-2 items-center px-4",
        item?.items === undefined && "!justify-between md:!justify-end"
      )}
    >
      {isShowSearchBar && (
        <li className="w-auto">
          {isShowButtonSearch ? (
            <IconButton variant="solid" radius="full" as={Link} href="/search">
              <FiSearch />
            </IconButton>
          ) : (
            <Suspense>
              <Search wrapperClassName="!w-auto" />{" "}
            </Suspense>
          )}
        </li>
      )}
      <li className="flex gap-2 items-center">
        <ChatButton />
        <UserAvatar />
      </li>
    </NavbarContent>
  );
}
