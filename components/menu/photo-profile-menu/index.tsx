"use client";
import {
  usePhotoProfileActions,
  usePhotoProfileMenuIsOpen,
} from "@/stores/photo-profile-store";
import React, { useRef } from "react";
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

export default function PhotoProfileMenu() {
  const isOpen = usePhotoProfileMenuIsOpen();
  const { onClose } = usePhotoProfileActions();
  const { updateAccountImageAsync } = useUpdateMyAccountImage();
  const { deleteAccountImageAsync } = useDeleteMyAccountImage();
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
              body: "Are you sure want to delete your profile picture?",
              confirmColor: "danger",
              confirmLabel: "Delete",
              closeLabel: "Cancel",
            });
            await toast.promise(
              deleteAccountImageAsync({})
                .then((res) => res.data)
                .catch((err) => Promise.reject(err?.response?.data)),
              {
                pending: "Changing profile picture...",
                success: "Profile picture changed successfully",
                error: {
                  render({ data }) {
                    return (data as any)?.message ?? "Something went wrong!";
                  },
                },
              }
            );
          } catch (err) {
          } finally {
            onClose();
          }
        }
      }}
      items={[
        {
          key: "edit",
          label: "Upload photo profile",
          action: (
            <form className="absolute w-0 h-0" encType="multipart/form-data">
              <InputFile
                ref={fileInputRef}
                onChange={async (e) => {
                  if (!e?.target?.files?.[0]) return null;
                  try {
                    await confirm({
                      title: "Edit",
                      body: "Save changes with this picture?",
                      imgSrc: URL.createObjectURL(e?.target?.files?.[0] ?? ""),
                      imageClassName:
                        "w-150 h-150 object-cover rounded-full aspect-square border-2 border-divider",
                      size: "full",
                      modalClassNames: {
                        body: "items-center gap-5",
                      },
                      modalWrapperClassNames: {
                        base: "!h-full !w-full",
                      },
                    });
                    await toast.promise(
                      updateAccountImageAsync({
                        image: e?.target?.files?.[0],
                      })
                        .then((res) => res)
                        .catch((err) => Promise.reject(err)),
                      {
                        pending: "Changing profile picture...",
                        success: "Profile picture changed successfully",
                        error: {
                          render({ data }) {
                            return (
                              (data as any)?.message ?? "Something went wrong!"
                            );
                          },
                        },
                      }
                    );
                    await createPostAsync({
                      data: {
                        content: `${
                          session?.fullName ?? ""
                        } updated their profile picture`,
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
          label: "Delete photo profile",
          icon: <AiOutlineDelete />,
        },
      ]}
    />
  );
}
