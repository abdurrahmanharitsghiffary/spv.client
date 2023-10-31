"use client";
import React from "react";

import MenuLayout from "../layout";
import {
  useCommentMenuControls,
  useGetSelectedComment,
} from "./hooks/useCommentMenu";
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

export default function CommentMenu() {
  const { commentId } = useParams();
  const router = useRouter();
  const session = useSession();
  const showCommentEditForm = useShowCommentEditForm();
  const disclosure = useCommentMenuControls();
  const comment = useGetSelectedComment();

  const { isLiked } = useGetCommentIsLiked(comment?.id ?? -1);
  const { likeCommentAsync } = useLikeComment();
  const { unlikeCommentAsync } = useUnlikeComment();
  const { deleteCommentAsync } = useDeleteComment();

  const isAuthored = (comment?.user?.id ?? -1) === (session?.id ?? -2);
  const baseItems = [
    {
      key: "like-comment",
      label: isLiked?.data ? "Unlike comment" : "Like comment",
      icon: isLiked?.data ? (
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

  return (
    <MenuLayout
      onClose={disclosure.onClose}
      isOpen={disclosure.isOpen}
      items={isAuthored ? items : publicItems}
      onAction={async (key) => {
        try {
          if (key === "like-comment" && comment) {
            if (isLiked?.data)
              return await unlikeCommentAsync({ commentId: comment?.id });
            return await likeCommentAsync({ commentId: comment?.id });
          } else if (key === "delete-report-comment" && !isAuthored)
            return notifyToast("Cooming soon!");
          if (isAuthored) {
          }
          if (key === "delete-comment" && comment) {
            await deleteCommentAsync({ commentId: comment?.id });
          } else if (key === "edit-comment" && comment) {
            showCommentEditForm(comment);
          } else if (key === "delete-comment" && commentId) {
            await deleteCommentAsync(
              { commentId: Number(commentId) },
              {
                onSuccess: () => {
                  router.back();
                },
              }
            );
          }
        } catch (err) {
        } finally {
          disclosure.onClose();
        }
      }}
    />
  );
}
