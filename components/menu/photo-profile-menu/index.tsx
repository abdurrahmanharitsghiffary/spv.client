"use client";
import {
  usePhotoProfileActions,
  usePhotoProfileMenuIsOpen,
} from "@/stores/photo-profile-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MenuLayout from "../layout";
import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import {
  useDeleteMyAccountImage,
  useUpdateMyAccountImage,
} from "@/lib/api/account/mutation";
import { useCreatePost } from "@/lib/api/posts/mutation";
import { useSession } from "@/stores/auth-store";
import { useConfirm } from "@/stores/confirm-store";
import InputFile from "@/components/input/file";
import { toast } from "react-toastify";
import { zImage } from "@/lib/zod-schema/image";
import { useIsSm } from "@/hooks/use-media-query";

export default function PhotoProfileMenu() {
  const [file, setFile] = useState<File | null>(null);
  const isOpen = usePhotoProfileMenuIsOpen();
  const isSm = useIsSm();
  const { onClose } = usePhotoProfileActions();
  const { updateAccountImageAsync } = useUpdateMyAccountImage();
  const { deleteAccountImageAsync } = useDeleteMyAccountImage();
  const { createPostAsync } = useCreatePost();
  const confirm = useConfirm();
  const session = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMenuActions = async (key: React.Key) => {
    if (key === "edit") {
      fileInputRef.current?.click();
    } else if (key === "delete") {
      await confirm({
        title: "Delete",
        body: "Are you sure want to delete your profile picture?",
        confirmColor: "danger",
        confirmLabel: "Delete",
        closeLabel: "Cancel",
      });
      await toast.promise(deleteAccountImageAsync({}), {
        pending: "Changing profile picture...",
        success: "Profile picture successfully deleted.",
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
      });
    }
  };

  const handleFileUpload = useCallback(async () => {
    if (!file) return;
    try {
      await zImage.parseAsync(file);
      await confirm({
        title: "Edit",
        body: "Save changes with this picture?",
        imgSrc: URL.createObjectURL(file),
        imageClassName:
          "w-150 h-150 object-cover rounded-full aspect-square border-2 border-divider",
        size: isSm ? "md" : "full",
        modalClassNames: {
          body: "items-center gap-5",
        },
        modalWrapperClassNames: {
          wrapper: "sm:!justify-center",
          base: "!h-full sm:!h-auto right-0 md:max-w-sm !w-full",
        },
      });
      await toast.promise(
        updateAccountImageAsync({
          body: { image: file },
          formData: true,
        }),
        {
          pending: "Changing profile picture...",
          success: "Profile picture successfully changed",
          error: {
            render({ data }) {
              return (data as any)?.message ?? "Something went wrong!";
            },
          },
        }
      );
      await createPostAsync({
        body: {
          content: `${session?.fullName ?? ""} updated their profile picture`,
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files?.[0]) return null;
    setFile(e?.target?.files?.[0] ?? null);
    e.target.value = "";
  };

  return (
    <>
      <MenuLayout
        isOpen={isOpen}
        onClose={onClose}
        onAction={handleMenuActions}
        items={[
          {
            key: "edit",
            label: "Upload photo profile",
            icon: <AiOutlineUpload />,
          },
          {
            key: "delete",
            label: "Delete photo profile",
            icon: <AiOutlineDelete />,
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
