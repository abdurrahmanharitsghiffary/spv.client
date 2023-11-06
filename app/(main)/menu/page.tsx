"use client";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { BsBookmark, BsChat, BsPostcard } from "react-icons/bs";
import { FiLogOut, FiMoon, FiSettings, FiUser, FiUserX } from "react-icons/fi";
import { useGetMyAccountInfo } from "@/lib/api/account/query";
import { TypographyMuted } from "@/components/ui/typography";
import Link from "next/link";
import { ThemeSwitchBase } from "@/components/theme-switch";
import { Skeleton } from "@nextui-org/skeleton";
import { useTheme } from "next-themes";
import { MdSecurity } from "react-icons/md";
import { useLogout } from "@/lib/api/auth";
import { useConfirm } from "@/stores/confirm-store";
import SendVerifyButton from "@/components/button/send-verify-button";
import { useRouter } from "next/navigation";
import { useShowEditProfile } from "@/hooks/use-edit-profile";
import { useShowChangePasswordModal } from "@/hooks/use-change-password-modal";
import { useIsSSR } from "@react-aria/ssr";
import { AiOutlineDelete } from "react-icons/ai";
import { useShowDeleteAccountModal } from "@/hooks/use-delete-account";
import { IoLanguage } from "react-icons/io5";

type ListboxItem = {
  label: string;
  key: string;
  url?: string;
  icon: React.JSX.Element;
  endContent?: React.JSX.Element | string;
};

type ListboxWithSectionItem = {
  key: string;
  section?: { title: string; showDivider?: boolean; items: ListboxItem[] };
};

export default function MenuPage() {
  const { myAccountInfo, isLoading, isSuccess } = useGetMyAccountInfo();
  const onOpen = useShowChangePasswordModal();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const isSSR = useIsSSR();
  const showProfileEdit = useShowEditProfile();
  const { logoutAsync } = useLogout();
  const confirm = useConfirm();
  const showDeleteModal = useShowDeleteAccountModal();

  const handleKeyAction = async (key: React.Key) => {
    switch (key) {
      case "dark-mode":
        return theme === "light" ? setTheme("dark") : setTheme("light");
      case "logout": {
        await confirm({
          confirmLabel: "Logout",
          confirmColor: "danger",
          body: "Logout from this account?",
          title: "Logout",
        });
        await logoutAsync();
        return null;
      }
      case "my-chats": {
        return router.push("/chats");
      }
      case "account-info": {
        return showProfileEdit();
      }
      case "saved-posts":
        return router.push("/posts/saved");
      case "account-password":
        return onOpen();
      case "account-delete": {
        const choice = await confirm({
          confirmLabel: "Confirm",
          confirmColor: "danger",
          body: "Are you sure want to delete this account?",
          title: "Delete",
        });

        if (choice) {
          showDeleteModal();
        }
        return null;
      }
      case "blocked-users": {
        return router.push("/users/blocked");
      }
      default:
        alert(key);
        break;
    }
  };

  const items: (ListboxWithSectionItem | ListboxItem)[] = [
    { icon: <BsChat />, label: "Messenger", key: "my-chats" },
    {
      key: "account-section",
      section: {
        items: [
          {
            key: "account-info",
            label: "Account informations",
            icon: <FiUser />,
          },
          {
            key: "account-password",
            label: "Password",
            icon: <MdSecurity />,
          },
          {
            key: "account-delete",
            label: "Delete Account",
            icon: <AiOutlineDelete />,
          },
        ],
        title: "Account",
      },
    },
    {
      key: "posts-section",
      section: {
        title: "Posts",
        items: [
          // {
          //   key: "posts",
          //   label: "My Posts",
          //   url: "/menu/posts",
          //   icon: <BsPostcard />,
          // },
          {
            key: "saved-posts",
            label: "Saved posts",
            url: "/bookmark",
            icon: <BsBookmark />,
          },
        ],
      },
    },
    {
      key: "setting-section",
      section: {
        title: "Settings & privacy",
        items: [
          {
            key: "settings",
            label: "Settings",
            url: "/settings",
            icon: <FiSettings />,
          },
          { key: "language", label: "Language", icon: <IoLanguage /> },
          { key: "blocked-users", label: "Blocked users", icon: <FiUserX /> },
          {
            key: "dark-mode",
            label: "Dark mode",
            icon: <FiMoon />,
            endContent: <ThemeSwitchBase />,
          },
        ],
      },
    },

    {
      key: "logout",
      label: "Logout",
      icon: <FiLogOut />,
    },
  ];
  console.log(myAccountInfo);
  return (
    <>
      <Link
        href="/profile"
        className="w-full mx-auto flex gap-2 items-center px-2 z-[1] p-1 group hover:backdrop-brightness-75 dark:hover:bg-default-200 transition-all sticky top-[64px] bg-background border-b-1 border-divider py-2"
      >
        <div className="w-fit">
          <Avatar
            className="dark:group-hover:bg-default-300 dark:transition-all"
            src={myAccountInfo?.data?.profile?.image?.src ?? ""}
            name={myAccountInfo?.data?.username}
          />
        </div>
        <div className="flex flex-col gap-2 w-[70%]">
          {isLoading ? (
            <>
              <Skeleton className="w-[80px] rounded-medium max-w-full h-3" />
              <Skeleton className="w-[65px] rounded-medium max-w-full h-3" />
            </>
          ) : (
            isSuccess && (
              <>
                <TypographyMuted>{`${myAccountInfo?.data?.firstName} ${myAccountInfo?.data?.lastName}`}</TypographyMuted>
                <p className="text-[0.75rem] text-default group-hover:text-default-800 dark:text-default-200 transition-all">
                  View profile
                </p>
              </>
            )
          )}
        </div>
      </Link>
      <div className="w-full px-2">
        {isSuccess && !myAccountInfo?.data?.verified ? (
          <div className="py-2 flex flex-col gap-2">
            <TypographyMuted>
              Account is not verified. pls verify your account
            </TypographyMuted>
            <SendVerifyButton
              className="w-fit"
              email={myAccountInfo?.data?.email ?? ""}
            />
          </div>
        ) : null}
      </div>

      <Listbox
        items={items}
        aria-label="Dynamic Actions"
        onAction={handleKeyAction}
        itemClasses={{ base: "py-3" }}
      >
        {(item) => {
          if ((item as ListboxWithSectionItem)?.section)
            return (
              <ListboxSection
                showDivider={
                  (item as ListboxWithSectionItem).section?.showDivider
                }
                // @ts-ignore
                title={item.section.title}
                key={item.key}
                // @ts-ignore
                items={item.section?.items}
              >
                {/* @ts-ignore */}
                {(item: ListboxItem) => (
                  <ListboxItem
                    key={item.key ?? ""}
                    color={item.key.includes("delete") ? "danger" : "default"}
                    className={item.key.includes("delete") ? "text-danger" : ""}
                    startContent={<IconWrapper>{item.icon}</IconWrapper>}
                    endContent={item?.endContent}
                  >
                    {item.label}
                  </ListboxItem>
                )}
              </ListboxSection>
            );
          return (
            <ListboxItem
              key={item.key ?? ""}
              color={item.key.includes("delete") ? "danger" : "default"}
              className={item.key.includes("delete") ? "text-danger" : ""}
              // @ts-ignore
              startContent={<IconWrapper>{item.icon}</IconWrapper>}
              // @ts-ignore
              endContent={item?.endContent}
            >
              {/* @ts-ignore */}
              {item.label}
            </ListboxItem>
          );
        }}
      </Listbox>
    </>
  );
}

function IconWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-fit h-fit text-[1.125rem] mr-1">{children}</div>;
}
