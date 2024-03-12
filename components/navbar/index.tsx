"use client";
import React, { useState } from "react";
import { NavbarBrand, Navbar as NavbarTemplate } from "@nextui-org/navbar";
import { useParams, usePathname, useRouter } from "next/navigation";
import NavActions from "./action";
import clsx from "clsx";
import NavEndContent from "./end-content";

const navItem: string[] = [];
// ["Home", "Login", "SignUp"];

const menuItems: { label: string; icon: React.JSX.Element }[] = [
  // { label: "Home", icon: <FaHome /> },
  // { label: "Login", icon: <FaInfo /> },
  // { label: "SignUp", icon: <FaDollarSign /> },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const { chatId } = useParams();
  return (
    <NavbarTemplate
      className={clsx(
        "fixed max-w-full flex justify-end w-auto",
        chatId && "sm:left-[300px] lg:left-[400px]"
      )}
      isBordered
      isBlurred={false}
      classNames={{
        wrapper: "px-0 gap-0 max-w-none",
        menu: "z-[500]",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      isMenuOpen={showMenu}
      onMenuOpenChange={setShowMenu}
    >
      {/* <NavbarBrand
        className={clsx("hidden md:flex px-4 gap-1", chatId && "!hidden")}
      >
        <span className="text-lg font-semibold">MyBrand</span>
      </NavbarBrand> */}
      <NavActions pathname={pathname} router={router} />
      <NavEndContent pathname={pathname} router={router} />
      {/* <NavbarContent className="hidden sm:flex">
        {navItem.map((item) => (
          <NavbarItem
            key={item}
            isActive={
              item === "Home" && pathname === "/"
                ? true
                : pathname === "/" + item.toLowerCase()
                ? true
                : false
            }
          >
            <Link href={`/${item === "Home" ? "" : item.toLowerCase()}`}>
              {" "}
              {item}
            </Link>
          </NavbarItem>
        ))}
        
      </NavbarContent> */}
      {/* <NavbarMenuToggle className="hidden" />
      <NavbarMenu className="sm:hidden gap-4">
        {menuItems.map((item) => (
          <NavbarMenuItem
            key={item.label}
            className="flex gap-2 items-center"
            onClick={() => setShowMenu(false)}
          >
            <Link
              className="text-inherit text-base"
              href={`/${item.label === "Home" ? "" : item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </NavbarTemplate>
  );
}
