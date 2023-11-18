"use client";

import React, { useRef } from "react";
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
  useHideProfileMenu,
  useProfileMenuIsOpen,
} from "@/stores/profile-menu-store";
import { useLogout } from "@/lib/api/auth";
import { FiLogOut } from "react-icons/fi";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/zod-schema/image";
import InputFile from "@/components/input/file";

export default function ProfileMenu() {
  const isOpen = useProfileMenuIsOpen();
  const onClose = useHideProfileMenu();
  const { logoutAsync } = useLogout();
  const { updateCoverImageAsync } = useUpdateMyCoverImage();
  const { deleteCoverImageAsync } = useDeleteMyCoverImage();
  const { createPostAsync } = useCreatePost();
  const confirm = useConfirm();
  const session = useSession();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <MenuLayout
      isOpen={isOpen}
      onClose={onClose}
      onAction={async (key) => {
        if (key === "edit") {
          fileInputRef.current?.click();
        } else if (key === "delete") {
          try {
            await confirm({
              title: "Delete",
              body: "Are you sure delete your cover image?",
              confirmColor: "danger",
              confirmLabel: "Delete",
              closeLabel: "Cancel",
            });
            await deleteCoverImageAsync({});
          } catch (err) {
          } finally {
            onClose();
          }
        } else if (key === "delete-logout") {
          try {
            await confirm({
              confirmLabel: "Logout",
              confirmColor: "danger",
              body: "Logout from this account?",
              title: "Logout account",
            });
            await logoutAsync();
          } catch (err) {
          } finally {
            onClose();
          }
        }
      }}
      items={[
        {
          key: "edit",
          label: "Upload cover image",
          action: (
            <form className="absolute w-0 h-0" encType="multipart/form-data">
              <InputFile
                ref={fileInputRef}
                onChange={async (e) => {
                  if (!e?.target?.files?.[0]) return null;
                  try {
                    await confirm({
                      title: "Change cover image",
                      body: "Save with this image?",
                      imgSrc: URL.createObjectURL(e?.target?.files?.[0] ?? ""),
                      imageClassName:
                        "h-[180px] w-full bg-default-100 rounded-none max-w-none bg-cover object-cover",
                      size: "full",
                      modalClassNames: {
                        body: "items-center gap-5",
                      },
                      modalWrapperClassNames: {
                        base: "!h-full !w-full",
                      },
                    });
                    await updateCoverImageAsync({
                      image: e?.target?.files?.[0],
                    });
                    await createPostAsync({
                      data: {
                        content: `${session?.fullName} updated their cover image`,
                        images: [e?.target?.files?.[0]],
                      },
                    });
                  } catch (err) {
                  } finally {
                    e.target.value = "";
                    onClose();
                  }
                }}
                className="absolute w-0 h-0"
              />
            </form>
          ),
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
  );
}
