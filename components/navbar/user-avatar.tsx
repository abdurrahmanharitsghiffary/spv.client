"use client";

import { useSession } from "@/stores/auth-store";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import Link from "next/link";
import React from "react";
import { useGetMyAccountInfo } from "@/lib/api/account/query";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/stores/confirm-store";
import { useLogout } from "@/lib/api/auth";
import { useTheme } from "next-themes";
import { ThemeSwitchBase } from "../theme-switch";

export default function UserAvatar() {
  const { resolvedTheme } = useTheme();
  const session = useSession();
  const { resp } = useGetMyAccountInfo();
  const data = resp?.data;
  const router = useRouter();
  const confirm = useConfirm();
  const { logoutAsync } = useLogout();

  if (session === null)
    return (
      <Button color="primary" as={Link} href="/login">
        Login
      </Button>
    );

  const handleDropdownActions = async (key: React.Key) => {
    switch (key) {
      case "profile": {
        return router.push("/profile");
      }
      case "logout": {
        await confirm({
          title: "Logout",
          body: "Logout from this account?",
          confirmLabel: "Logout",
          confirmColor: "danger",
        });
        await logoutAsync();
        return;
      }
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          size="sm"
          src={data?.profile?.avatarImage?.src}
          classNames={{
            base: "ring-offset-2 ring-primary ring-offset-background",
          }}
          className="flex-shrink-0"
        />
      </DropdownTrigger>
      <DropdownMenu onAction={handleDropdownActions}>
        <DropdownItem key="profile" startContent={<FiUser />}>
          Profile
        </DropdownItem>
        <DropdownItem
          key="dark_mode"
          startContent={resolvedTheme === "dark" ? <FiMoon /> : <FiSun />}
          endContent={<ThemeSwitchBase />}
        >
          Dark mode
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          startContent={<RiLogoutBoxLine />}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
