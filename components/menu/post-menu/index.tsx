"use client";
import React from "react";
import MenuLayout from "../layout";
import {
  useGetSelectedPost,
  useHidePostMenu,
  usePostMenuIsOpen,
  useSetSelectedPost,
} from "@/stores/post-menu-store";
import {
  AiFillHeart,
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { GoReport } from "react-icons/go";
import { DropdownProps } from "@/components/dropdown";
import { useGetPostIsLiked, useGetPostIsSaved } from "@/lib/api/posts/query";
import { useSession } from "@/stores/auth-store";
import { notifyToast } from "@/lib/toast";
import { postById } from "@/lib/endpoints";
import {
  useDeletePost,
  useDeleteSavedPost,
  useLikePost,
  useSavePost,
  useUnlikePost,
} from "@/lib/api/posts/mutation";
import { useShowEditPost } from "@/hooks/use-edit-post";
import { useConfirm } from "@/stores/confirm-store";

export default function PostMenu() {
  const isOpen = usePostMenuIsOpen();
  const onClose = useHidePostMenu();
  const session = useSession();
  const setSelectedPost = useSetSelectedPost();
  const selectedPost = useGetSelectedPost();
  const { isLiked } = useGetPostIsLiked(selectedPost?.id ?? -1);
  const { isSaved } = useGetPostIsSaved(selectedPost?.id ?? -1);
  const { savePostAsync } = useSavePost();
  const { deleteSavedPostAsync } = useDeleteSavedPost();
  const { likePostAsync } = useLikePost();
  const { unlikePostAsync } = useUnlikePost();
  const { deletePostAsync } = useDeletePost();
  const showEditForm = useShowEditPost();
  const confirm = useConfirm();

  const isAuthored = session?.id === selectedPost?.author?.id;

  const baseItems: DropdownProps[] = [
    {
      key: "like",
      label: isLiked?.data ? "Unlike post" : "Like post",
      icon: isLiked?.data ? (
        <AiFillHeart className="text-danger" />
      ) : (
        <AiOutlineHeart />
      ),
    },
    {
      key: "save",
      label: isSaved?.data ? "Remove post" : "Save post",
      icon: isSaved?.data ? (
        <BsBookmarkFill className="text-secondary" />
      ) : (
        <BsBookmark className="text-secondary" />
      ),
    },
    { key: "copy", label: "Copy link", icon: <AiOutlineCopy /> },
    { key: "share", label: "Share post", icon: <AiOutlineShareAlt /> },
  ];

  const publicItems: DropdownProps[] = [
    ...baseItems,
    { key: "report", label: "Report post", icon: <GoReport /> },
  ];

  const items: DropdownProps[] = [
    ...baseItems,
    {
      key: "edit",
      label: "Edit post",
      icon: <AiOutlineEdit />,
    },
    {
      key: "delete",
      label: "Delete post",
      icon: <AiOutlineDelete />,
    },
  ];

  const handleMenuAction = async (key: React.Key) => {
    try {
      switch (key) {
        case "copy": {
          await navigator.clipboard.writeText(
            postById(selectedPost?.id?.toString() ?? "")
          );
          notifyToast("Copied to clipboard!");
          return null;
        }
        case "like": {
          if (!selectedPost) return null;
          if (isLiked?.data)
            return await unlikePostAsync({ postId: selectedPost?.id });
          return await likePostAsync({ postId: selectedPost?.id });
        }
        case "save": {
          if (!selectedPost) return null;
          if (isSaved?.data) {
            return deleteSavedPostAsync({ postId: selectedPost?.id });
          }
          return savePostAsync({ postId: selectedPost?.id });
        }
        case "report":
          return notifyToast("Cooming soon!");
        case "delete": {
          if (!isAuthored || !selectedPost) return null;
          await confirm({
            title: "Delete post",
            body: "Are you sure delete this post?",
            confirmColor: "danger",
            confirmLabel: "Delete",
          });
          await deletePostAsync({ postId: selectedPost?.id });
        }
        case "edit": {
          if (!isAuthored || !selectedPost) return null;
          showEditForm(selectedPost?.id);
        }
        default:
          return null;
      }
    } catch (err) {
      console.error(err, " Post Menu Error");
    } finally {
      setSelectedPost(null);
      onClose();
    }
  };

  return (
    <MenuLayout
      onAction={handleMenuAction}
      isOpen={isOpen}
      onClose={onClose}
      items={isAuthored ? items : publicItems}
    />
  );
}
