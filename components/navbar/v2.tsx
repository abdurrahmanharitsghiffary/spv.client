"use client";
import React from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import Link from "next/link";
import { items } from "../bottom-bar/bar-items";
import { usePathname } from "next/navigation";
import UserAvatar from "./user-avatar";

export default function NavbarV2() {
  const pathname = usePathname();
  return (
    <Navbar isBordered>
      <NavbarContent></NavbarContent>
      <NavbarContent className="flex gap-4 items-center" justify="center">
        {items.map((item) => (
          <NavbarItem isActive={pathname === item.url} key={item.label}>
            <Link color="foreground" href={item.url}>
              {item.icon}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <UserAvatar />
      </NavbarContent>
    </Navbar>
  );
}
