"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { FiMoreVertical } from "react-icons/fi";
import { useSession } from "@/stores/auth-store";
import DropdownBase, { DropdownProps } from "../dropdown";
import {
  AiFillHeart,
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { GoReport } from "react-icons/go";
import { postById } from "@/lib/endpoints";
import { notifyToast } from "@/lib/toast";
import {
  useDeletePost,
  useDeleteSavedPost,
  useLikePost,
  useSavePost,
  useUnlikePost,
} from "@/lib/api/posts/mutation";
import { useConfirm } from "@/stores/confirm-store";
import { useShowEditPost } from "@/hooks/use-edit-post";
import { useGetPostIsLiked, useGetPostIsSaved } from "@/lib/api/posts/query";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

const baseItems: (isLiked?: boolean, isSaved?: boolean) => DropdownProps[] = (
  isLiked,
  isSaved
) => [
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
    label: isSaved ? "Remove post" : "Save post",
    icon: isSaved ? (
      <BsBookmarkFill className="text-secondary" />
    ) : (
      <BsBookmark className="text-secondary" />
    ),
  },
  { key: "copy", label: "Copy link", icon: <AiOutlineCopy /> },
  { key: "share", label: "Share post", icon: <AiOutlineShareAlt /> },
];

const publicItems: (isLiked?: boolean, isSaved?: boolean) => DropdownProps[] = (
  isLiked,
  isSaved
) => [
  ...baseItems(isLiked, isSaved),
  { key: "report", label: "Report post", icon: <GoReport /> },
];

const items: (isLiked?: boolean, isSaved?: boolean) => DropdownProps[] = (
  isLiked,
  isSaved
) => [
  ...baseItems(isLiked, isSaved),
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

export default function PostDropdown({
  postAuthorId,
  postId,
}: {
  postAuthorId: number;
  postId: number;
}) {
  const session = useSession();
  if (session?.id === postAuthorId) {
    return <PostPrivateDropdown postId={postId} />;
  }
  return <PostPublicDropdown postId={postId} />;
}

function PostPublicDropdown({ postId }: { postId: number }) {
  const { isLiked } = useGetPostIsLiked(postId);
  const { savePostAsync } = useSavePost();
  const { deleteSavedPostAsync } = useDeleteSavedPost();
  const { likePostAsync } = useLikePost();
  const { unlikePostAsync } = useUnlikePost();
  const { isSaved } = useGetPostIsSaved(postId);
  return (
    <DropdownBase
      items={publicItems(isLiked?.data, isSaved?.data)}
      ariaLabelledBy="Post-dropdown-pub"
      onAction={async (key) => {
        if (key === "copy") {
          await navigator.clipboard.writeText(postById(postId.toString()));
          notifyToast("Copied to clipboard!");
          return null;
        } else if (key === "like") {
          if (isLiked?.data) return await unlikePostAsync({ postId });
          return await likePostAsync({ postId });
        } else if (key === "save") {
          if (isSaved?.data) {
            return deleteSavedPostAsync({ postId });
          }
          return savePostAsync({ postId });
        } else if (key === "report") return notifyToast("Cooming soon!");
      }}
    >
      <Button isIconOnly variant="light" radius="full">
        <FiMoreVertical />
      </Button>
    </DropdownBase>
  );
}

function PostPrivateDropdown({ postId }: { postId: number }) {
  const { deletePostAsync } = useDeletePost();
  const showEditForm = useShowEditPost();
  const confirm = useConfirm();
  const { isLiked } = useGetPostIsLiked(postId);
  const { savePostAsync } = useSavePost();
  const { deleteSavedPostAsync } = useDeleteSavedPost();
  const { likePostAsync } = useLikePost();
  const { unlikePostAsync } = useUnlikePost();
  const { isSaved } = useGetPostIsSaved(postId);

  return (
    <DropdownBase
      items={items(isLiked?.data, isSaved?.data)}
      ariaLabelledBy="Post-dropdown-priv"
      onAction={async (key) => {
        if (key === "copy") {
          await navigator.clipboard.writeText(postById(postId.toString()));
          notifyToast("Copied to clipboard!");
          return null;
        } else if (key === "delete") {
          await confirm({
            title: "Delete post",
            body: "Are you sure delete this post?",
            confirmColor: "danger",
            confirmLabel: "Delete",
          });
          await deletePostAsync({ postId });
        } else if (key === "edit") {
          showEditForm(postId);
        } else if (key === "save") {
          if (isSaved?.data) {
            return deleteSavedPostAsync({ postId });
          }
          return savePostAsync({ postId });
        } else if (key === "like") {
          if (isLiked?.data) return await unlikePostAsync({ postId });
          return await likePostAsync({ postId });
        }
      }}
    >
      <Button isIconOnly variant="light" radius="full">
        <FiMoreVertical />
      </Button>
    </DropdownBase>
  );
}
