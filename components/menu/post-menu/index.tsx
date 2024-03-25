"use client";
import React from "react";
import MenuLayout from "../layout";
import {
  useGetSelectedPost,
  useHidePostMenu,
  usePostMenuIsOpen,
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
import {
  useDeletePost,
  useDeleteSavedPost,
  useLikePost,
  useSavePost,
  useUnlikePost,
} from "@/lib/api/posts/mutation";
import { useShowEditPost } from "@/hooks/use-edit-post";
import { useConfirm } from "@/stores/confirm-store";
import { MdOutlineInfo } from "react-icons/md";
import { usePostLikeModalActions } from "@/stores/post-likes-modal-store";
import { url } from "@/lib/consts";
import { useReportModalActions } from "@/stores/report-modal-store";

export default function PostMenu() {
  const isOpen = usePostMenuIsOpen();
  const onClose = useHidePostMenu();
  const { onOpen } = usePostLikeModalActions();
  const session = useSession();
  const selectedPost = useGetSelectedPost();
  const { resp, isLoading: isLoadILik } = useGetPostIsLiked(
    selectedPost?.id ?? -1
  );
  const isLiked = resp?.data?.isLiked ?? false;
  const { isSaved, isLoading: isLoadISav } = useGetPostIsSaved(
    selectedPost?.id ?? -1
  );
  const { savePostAsync } = useSavePost();
  const { deleteSavedPostAsync } = useDeleteSavedPost();
  const { likePostAsync } = useLikePost();
  const { unlikePostAsync } = useUnlikePost();
  const { deletePostAsync } = useDeletePost();
  const showEditForm = useShowEditPost();
  const confirm = useConfirm();
  const { onOpen: openReportModal } = useReportModalActions();

  const isAuthored = session?.id === selectedPost?.authorId;

  const baseItems: DropdownProps[] = [
    { key: "details", label: "See post details", icon: <MdOutlineInfo /> },
    {
      key: "like",
      label: isLiked ? "Unlike post" : "Like post",
      icon: isLiked ? (
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
    { key: "report-delete", label: "Report post", icon: <GoReport /> },
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

  const handleMenuActions = async (key: React.Key) => {
    switch (key) {
      case "details": {
        onOpen(selectedPost?.id ?? -1);
        return null;
      }
      case "copy": {
        await navigator.clipboard.writeText(url(`/posts/${selectedPost?.id}`));
        notifyToast("Copied to clipboard!");
        return null;
      }
      case "like": {
        if (!selectedPost) return null;
        if (isLiked)
          return await unlikePostAsync({
            params: { postId: selectedPost?.id },
          });
        return await likePostAsync({ params: { postId: selectedPost?.id } });
      }
      case "save": {
        if (!selectedPost) return null;
        if (isSaved?.data) {
          await confirm({
            title: "Delete",
            body: "Are you sure want to delete this post from your saved posts?",
            confirmColor: "danger",
            confirmLabel: "Delete",
          });
          return deleteSavedPostAsync({ params: { postId: selectedPost?.id } });
        }
        return savePostAsync({ body: { postId: selectedPost?.id } });
      }
      case "report-delete": {
        if (selectedPost?.id) openReportModal("post", selectedPost?.id);
        // return notifyToast("Cooming soon!");
        break;
      }
      case "delete": {
        if (!isAuthored || !selectedPost) return null;
        await confirm({
          title: "Delete",
          body: "Are you sure want to delete this post?",
          confirmColor: "danger",
          confirmLabel: "Delete",
        });
        await deletePostAsync({ params: { postId: selectedPost?.id } });
        break;
      }
      case "edit": {
        if (!isAuthored || !selectedPost) return null;
        showEditForm(selectedPost?.id);
        break;
      }
      default:
        return null;
    }
  };

  return (
    <MenuLayout
      isLoading={isLoadILik || isLoadISav}
      onAction={handleMenuActions}
      isOpen={isOpen}
      shouldToastWhenActionError
      onClose={onClose}
      items={isAuthored ? items : publicItems}
    />
  );
}
