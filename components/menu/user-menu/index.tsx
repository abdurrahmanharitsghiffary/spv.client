"use client";
import React from "react";
import MenuLayout from "../layout";
import {
  useUserMenuActions,
  useUserMenuIsOpen,
} from "@/stores/user-menu-store";
import { BiBlock } from "react-icons/bi";
import { GoReport } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import {
  useFollowAccount,
  useUnfollowAccount,
} from "@/lib/api/follow/mutation";
import { useGetUserIsFollowed } from "@/lib/api/users/query";
import { useParams, useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useConfirm } from "@/stores/confirm-store";
import { useBlockUser } from "@/lib/api/users/mutation";

export default function UserMenu() {
  const confirm = useConfirm();
  const isOpen = useUserMenuIsOpen();
  const { onClose } = useUserMenuActions();
  const router = useRouter();
  const params = useParams();
  const { followAccountAsync } = useFollowAccount();
  const { unfollowAccountAsync } = useUnfollowAccount();
  const { isFollowed, isLoading: isLoadIsFollowed } = useGetUserIsFollowed(
    Number(params.userId ?? -1)
  );
  const { blockUserAsync } = useBlockUser();

  const handleMenuActions = async (key: React.Key) => {
    if (key === "follow") {
      if (isFollowed?.data) {
        return await unfollowAccountAsync({
          params: { userId: Number(params.userId ?? -1) },
        });
      }
      return await followAccountAsync({
        body: { userId: Number(params.userId ?? -1) },
      });
    } else if (key === "message") {
      router.push(`/chats/${params.userId ?? -1}`);
    } else if (key === "block-delete") {
      await confirm({
        body: "Are you sure want to block this user?",
        title: "Block",
        confirmLabel: "Block",
        confirmColor: "danger",
      });
      await blockUserAsync({ body: { userId: Number(params.userId ?? -1) } });
    }
  };

  const items = [
    {
      key: "follow",
      label: isFollowed?.data ? "Unfollow user" : "Follow user",
      icon: isFollowed?.data ? (
        <AiFillHeart className="text-danger" />
      ) : (
        <AiOutlineHeart />
      ),
    },
    {
      key: "message",
      label: "Message user",
      icon: <BsChat />,
    },
    {
      key: "report-delete",
      label: "Report user",
      icon: <GoReport />,
    },
    {
      key: "block-delete",
      label: "Block user",
      icon: <BiBlock />,
    },
  ];

  return (
    <MenuLayout
      isOpen={isOpen}
      isLoading={isLoadIsFollowed}
      onClose={onClose}
      items={items}
      onAction={handleMenuActions}
    />
  );
}
