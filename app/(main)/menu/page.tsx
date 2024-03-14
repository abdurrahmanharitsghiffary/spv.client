"use client";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { BsBookmark, BsChat } from "react-icons/bs";
import { FiLogOut, FiMoon, FiSettings, FiUser, FiUserX } from "react-icons/fi";
import { useGetMyAccountInfo } from "@/lib/api/account/query";
import { TypographyMuted } from "@/components/ui/typography";
import Link from "next/link";
import { ThemeSwitchBase } from "@/components/theme-switch";
import { Skeleton } from "@nextui-org/skeleton";
import { useTheme } from "next-themes";
import { MdOutlineAssignment, MdSecurity } from "react-icons/md";
import { useLogout } from "@/lib/api/auth";
import { useConfirm } from "@/stores/confirm-store";
import SendVerifyButton from "@/components/button/send-verify-button";
import { useRouter } from "next/navigation";
import { useShowEditProfile } from "@/hooks/use-edit-profile";
import { useShowChangePasswordModal } from "@/hooks/use-change-password-modal";
import { AiOutlineDelete } from "react-icons/ai";
import { useShowDeleteAccountModal } from "@/hooks/use-delete-account";
import { IoBugOutline, IoLanguage } from "react-icons/io5";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { toast } from "react-toastify";
import { urlBase } from "@/lib/endpoints";
import { useSetSession } from "@/stores/auth-store";
import { FaBug } from "react-icons/fa";
import { useReportModalActions } from "@/stores/report-modal-store";

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
  const { resp, isLoading, isSuccess } = useGetMyAccountInfo();
  const onOpen = useShowChangePasswordModal();
  const setSession = useSetSession();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const request = useAxiosInterceptor();
  const showProfileEdit = useShowEditProfile();
  const { logoutAsync } = useLogout();
  const { onOpen: openReportBugModal } = useReportModalActions();
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
      case "report-bug": {
        openReportBugModal();
        return;
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

        if (choice && resp?.data?.provider === "GOOGLE") {
          const choice2 = await confirm({
            confirmLabel: "Delete",
            confirmColor: "danger",
            body: "Confirm again to delete your account \n(account will be deleted).",
            title: "Delete",
          });
          if (choice2) {
            await toast.promise(
              request
                .delete(urlBase("/auth/google"))
                .then((res) => res.data)
                .catch((err) => Promise.reject(err?.response?.data)),
              {
                error: {
                  render({ data }) {
                    return (data as any)?.message ?? "Something went wrong!";
                  },
                },
                pending: "Submitting...",
                success: "Account successfully deleted",
              }
            );
            setSession(null);
            router.push("/login");
            return null;
          } else {
            return null;
          }
        }

        if (choice) {
          showDeleteModal();
        }
        return null;
      }
      case "blocked-users": {
        return router.push("/users/blocked");
      }
      default:
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
            url: "/posts/saved",
            icon: <BsBookmark />,
          },
        ],
      },
    },
    {
      key: "group-section",
      section: {
        title: "Groups",
        items: [
          {
            icon: <MdOutlineAssignment />,
            key: "membership-requests",
            label: "My membership requests",
            url: "/membership-requests",
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
      icon: <IoBugOutline />,
      key: "report-bug",
      label: "Report bug",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <FiLogOut />,
    },
  ];

  if (resp?.data?.provider !== null) {
    if (
      (items as any)?.[1]?.section?.items &&
      (items as any)?.[1]?.section?.items?.length > 0
    ) {
      const secItems = (items as any)?.[1]?.section?.items;
      (items as any)[1].section.items = secItems.filter(
        (item: any) => item.key !== "account-password"
      );
    }
  }

  return (
    <>
      <Link
        href="/profile"
        className="w-full mx-auto flex gap-2 items-center px-2 z-[1] p-1 group hover:backdrop-brightness-75 dark:hover:bg-default-200 transition-all sticky top-[64px] bg-background border-b-1 border-divider py-2"
      >
        <div className="w-fit">
          <Avatar
            className="dark:group-hover:bg-default-300 dark:transition-all"
            src={resp?.data?.profile?.avatarImage?.src ?? ""}
            name={resp?.data?.username}
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
                <TypographyMuted>{`${resp?.data?.firstName} ${resp?.data?.lastName}`}</TypographyMuted>
                <p className="text-[0.75rem]">View profile</p>
              </>
            )
          )}
        </div>
      </Link>
      <div className="w-full px-2">
        {isSuccess && !resp?.data?.verified ? (
          <div className="py-2 flex flex-col gap-2">
            <TypographyMuted>
              Account is not verified. pls verify your account
            </TypographyMuted>
            <SendVerifyButton
              className="w-fit"
              email={resp?.data?.email ?? ""}
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
                    href={item.url}
                    textValue={item.label}
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
              // @ts-ignore
              textValue={item.label}
              // @ts-ignore
              href={item?.url}
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
