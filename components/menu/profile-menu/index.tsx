"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import MenuLayout from "../layout";
import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import {
  useDeleteMyCoverImage,
  useUpdateMyCoverImage,
} from "@/lib/api/account/mutation";
import { useCreatePost } from "@/lib/api/posts/mutation";
import { useSession } from "@/stores/auth-store";
import { useConfirm } from "@/stores/confirm-store";
import {
  useProfileMenuActions,
  useProfileMenuIsOpen,
} from "@/stores/profile-menu-store";
import { useLogout } from "@/lib/api/auth";
import { FiLogOut } from "react-icons/fi";
import InputFile from "@/components/input/file";
import { toast } from "react-toastify";
import { zImage } from "@/lib/zod-schema/image";

export default function ProfileMenu() {
  const isOpen = useProfileMenuIsOpen();
  const [file, setFile] = useState<File | null>(null);
  const { onClose } = useProfileMenuActions();
  const { logoutAsync } = useLogout();
  const { updateCoverImageAsync } = useUpdateMyCoverImage();
  const { deleteCoverImageAsync } = useDeleteMyCoverImage();
  const { createPostAsync } = useCreatePost();
  const confirm = useConfirm();
  const session = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMenuActions = async (key: React.Key) => {
    const fileElement = fileInputRef.current;
    if (key === "edit") {
      fileElement?.click();
    } else if (key === "delete") {
      await confirm({
        title: "Delete",
        body: "Are you sure delete your cover image?",
        confirmColor: "danger",
        confirmLabel: "Delete",
        closeLabel: "Cancel",
      });
      await deleteCoverImageAsync({});
    } else if (key === "delete-logout") {
      await confirm({
        confirmLabel: "Logout",
        confirmColor: "danger",
        body: "Logout from this account?",
        title: "Logout account",
      });
      await logoutAsync();
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files?.[0]) return null;
    setFile(e?.target?.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleFileUpload = useCallback(async () => {
    if (!file) return;
    try {
      await zImage.parseAsync(file);
      await confirm({
        title: "Change cover image",
        body: "Save with this image?",
        imgSrc: URL.createObjectURL(file ?? ""),
        imageClassName:
          "h-[180px] w-full bg-default-100 rounded-none max-w-none bg-cover object-cover",
        size: "full",
        modalClassNames: {
          body: "items-center gap-5",
        },
        modalWrapperClassNames: {
          wrapper: "sm:!justify-end",
          base: "!h-full right-0 md:max-w-sm !w-full",
        },
      });
      await toast.promise(
        updateCoverImageAsync({
          body: {
            image: file,
          },
          formData: true,
        })
          .then((res) => res)
          .catch((err) => Promise.reject(err)),
        {
          pending: "Changing cover picture...",
          success: "Cover picture successfully changed",
          error: {
            render({ data }) {
              return (data as any)?.message ?? "Something went wrong!";
            },
          },
        }
      );
      await createPostAsync({
        body: {
          content: `${session?.fullName} updated their cover image`,
          images: [file],
        },
        formData: true,
      });
    } catch (err: any) {
      if (err?.errors?.[0]?.message)
        toast.error(err?.errors?.[0]?.message ?? "Something went wrong!", {
          autoClose: 5500,
        });
    } finally {
      setFile(null);
    }
  }, [file, session?.fullName]);

  useEffect(() => {
    handleFileUpload();
  }, [handleFileUpload]);

  return (
    <>
      <MenuLayout
        shouldToastWhenActionError
        isOpen={isOpen}
        onClose={onClose}
        onAction={handleMenuActions}
        items={[
          {
            key: "edit",
            label: "Upload cover image",
            icon: <AiOutlineUpload />,
          },
          {
            key: "delete",
            label: "Delete cover image",
            icon: <AiOutlineDelete />,
          },
          {
            key: "delete-logout",
            label: "Logout from account",
            icon: <FiLogOut />,
          },
        ]}
      />
      <InputFile
        ref={fileInputRef}
        onChange={handleInputChange}
        className="absolute w-0 h-0 hidden"
      />
    </>
  );
}

// WHEN UPDATING PROFILE FROM PROFILE MODAL SHOULD POST ABOUT UPDATING PHOTO?
