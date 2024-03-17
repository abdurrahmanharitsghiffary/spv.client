"use client";
import React from "react";

import MenuLayout from "../layout";
import {
  useCommentMenuIsOpen,
  useGetSelectedComment,
  useHideCommentMenu,
} from "@/stores/comment-menu-store";
import {
  AiFillHeart,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHeart,
} from "react-icons/ai";
import { GoReport } from "react-icons/go";
import { useGetCommentIsLiked } from "@/lib/api/comments/query";
import {
  useDeleteComment,
  useLikeComment,
  useUnlikeComment,
} from "@/lib/api/comments/mutation";
import { useSession } from "@/stores/auth-store";
import { useShowCommentEditForm } from "@/stores/comment-edit-store";
import { notifyToast } from "@/lib/toast";
import { useParams, useRouter } from "next/navigation";
import { useConfirm } from "@/stores/confirm-store";
import { MdOutlineInfo } from "react-icons/md";
import { useCommentLikeModalActions } from "@/stores/comment-likes-modal-store";

export default function CommentMenu() {
  const { commentId } = useParams();
  const router = useRouter();
  const session = useSession();
  const onClose = useHideCommentMenu();
  const isOpen = useCommentMenuIsOpen();
  const showCommentEditForm = useShowCommentEditForm();
  const { onOpen } = useCommentLikeModalActions();
  const comment = useGetSelectedComment();
  const confirm = useConfirm();
  const { resp, isLoading: isLoadIsLiked } = useGetCommentIsLiked(
    comment?.id ?? -1
  );
  const isLiked = resp?.data?.isLiked ?? false;
  const { likeCommentAsync } = useLikeComment();
  const { unlikeCommentAsync } = useUnlikeComment();
  const { deleteCommentAsync } = useDeleteComment();
  const isAuthored = (comment?.authorId ?? -1) === (session?.id ?? -2);

  const baseItems = [
    { key: "details", label: "See comment details", icon: <MdOutlineInfo /> },
    {
      key: "like-comment",
      label: isLiked ? "Unlike comment" : "Like comment",
      icon: isLiked ? (
        <AiFillHeart className="text-danger" />
      ) : (
        <AiOutlineHeart />
      ),
    },
  ];

  const publicItems = [
    ...baseItems,
    {
      key: "delete-report-comment",
      label: "Report comment",
      icon: <GoReport />,
    },
  ];

  const items = [
    ...baseItems,
    { key: "edit-comment", label: "Edit comment", icon: <AiOutlineEdit /> },
    {
      key: "delete-comment",
      label: "Delete comment",
      icon: <AiOutlineDelete />,
    },
  ]
    .slice()
    .sort((a, b) => {
      if (a.key.includes("delete")) return 1;
      if (b.key.includes("delete")) return -1;
      return 1;
    });

  const handleMenuActions = async (key: React.Key) => {
    if (key === "like-comment" && comment) {
      if (isLiked)
        return await unlikeCommentAsync({ params: { commentId: comment?.id } });
      return await likeCommentAsync({ params: { commentId: comment?.id } });
    } else if (key === "delete-report-comment" && !isAuthored) {
      return notifyToast("Cooming soon!");
    } else if (key === "details") {
      onOpen(comment?.id ?? Number(commentId));
      return;
    }
    if (isAuthored) {
      if (key === "delete-comment" && commentId && !comment) {
        return await deleteCommentAsync(
          { params: { commentId: Number(commentId) } },
          {
            onSuccess: () => {
              router.back();
            },
          }
        );
      } else if (key === "delete-comment" && comment) {
        await confirm({
          title: "Delete",
          body: "Are you sure want to delete this comment?",
          confirmColor: "danger",
          confirmLabel: "Delete",
        });
        await deleteCommentAsync({ params: { commentId: comment?.id } });
        return null;
      } else if (key === "edit-comment" && comment) {
        showCommentEditForm(comment);
        return null;
      }
    }
  };

  return (
    <MenuLayout
      isLoading={isLoadIsLiked}
      onClose={onClose}
      isOpen={isOpen}
      shouldToastWhenActionError
      items={isAuthored ? items : publicItems}
      onAction={handleMenuActions}
    />
  );
}
