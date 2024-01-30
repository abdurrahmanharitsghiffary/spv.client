"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import ModalLayoutV2 from "../layoutV2";
import { UserAccountPublic, UserGroup } from "@/types/user";
import UserAutocomplete from "@/components/user/user-autocomplete";
import { removeDuplicates } from "@/lib";
import { getUserSimplified } from "@/lib/getUserSimplified";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zImage } from "@/lib/zod-schema/image";
import ValidationErrorText from "@/components/validation-error-text";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { FiEdit } from "react-icons/fi";
import InputFile from "@/components/input/file";
import { BsCardImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { useUpdateGroupChat } from "@/lib/api/chats/mutation";
import {
  useEditGroupActions,
  useEditGroupIsOpen,
} from "@/stores/edit-group-store";
import {
  InputWithControl,
  TextareaWithControl,
} from "@/components/input/input-with-control";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import { useParams } from "next/navigation";
import { TypographyLarge } from "@/components/ui/typography";
import UserGroupLists from "@/components/user/user-group-lists";
import { ParticipantsField } from "@/types";
import { MdGroup } from "react-icons/md";
import { useConfirm } from "@/stores/confirm-store";
import { DISCARD_CHANGE_CONFIRM_PROPS, saveChangesProps } from "@/lib/consts";
import CancelButton from "@/components/button/reset-button";

const editGroupSchema = z.object({
  participants: z.any().array().optional(),
  title: z
    .string()
    .max(125, { message: "Title must be at least 125 characters or fewer" })
    .optional(),
  description: z.string().optional(),
  image: zImage.optional(),
});

type EditGroupSchema = z.infer<typeof editGroupSchema>;

export default function EditGroupModal() {
  const confirm = useConfirm();
  const { groupId } = useParams();
  const { chatRoom } = useGetChatRoomById(Number(groupId));
  const { updateGroupChatAsync } = useUpdateGroupChat();
  const {
    formState: { isSubmitSuccessful, errors, isSubmitting },
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = useForm<EditGroupSchema>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      description: "",
      image: null,
      participants: [],
      title: "",
    },
    values: {
      participants: [],
      description: chatRoom?.data?.description ?? "",
      title: chatRoom?.data?.title ?? "",
    },
  });
  const selectedUsers = watch("participants") ?? [];
  const isOpen = useEditGroupIsOpen();
  const { onClose } = useEditGroupActions();

  const handleReset = useCallback(() => {
    reset();
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) handleClose();
  }, [isSubmitSuccessful]);

  const handleItemClick = useCallback(
    (item: UserAccountPublic) => {
      setValue(
        "participants",
        removeDuplicates([
          ...(selectedUsers ?? []),
          { ...getUserSimplified(item), role: "user" },
        ]).slice()
      );
    },
    [selectedUsers]
  );

  const handleCloseClick = useCallback(
    (user: UserGroup) => {
      setValue(
        "participants",
        selectedUsers.filter((item: any) => item.id !== user.id)
      );
    },
    [selectedUsers]
  );

  const onSubmit: SubmitHandler<EditGroupSchema> = async (data) => {
    if (isSubmitting) return null;
    await confirm(saveChangesProps("group"));
    await toast.promise(
      updateGroupChatAsync({
        body: {
          image: data?.image,
          participants: (data?.participants ?? []).map((p) => ({
            id: p.id,
            role: p.role,
          })) as ParticipantsField[],
          title: data?.title,
          description: data?.description,
        },
        formData: true,
        params: {
          groupId: Number(groupId),
        },
      })
        .then((res) => res)
        .catch((err) => Promise.reject(err)),
      {
        success: "Group chat successfully updated.",
        pending: "Updating group chat...",
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
      }
    );
  };

  const file = watch("image");
  const groupPictureSrc = useMemo(
    () =>
      file ? URL.createObjectURL(file) : chatRoom?.data?.picture?.src ?? "",
    [file, chatRoom?.data?.picture?.src]
  );

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={handleClose}
      footer={
        <div className="flex gap-2">
          <CancelButton onReset={reset} />
          <Button type="submit" form="edit_group_form" color="primary">
            Save changes
          </Button>
        </div>
      }
    >
      {errors?.participants?.message && (
        <ValidationErrorText>
          {errors?.participants?.message}
        </ValidationErrorText>
      )}
      <form
        className="p-4 px-0 flex flex-col gap-6 max-w-lg"
        id="edit_group_form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-fit h-fit mx-auto flex flex-col gap-4 justify-center items-center">
          <TypographyLarge>Group picture</TypographyLarge>
          <Avatar
            fallback={<MdGroup size={40} />}
            src={groupPictureSrc}
            showFallback
            isBordered
            className="w-[120px] h-[120px] aspect-square"
          />

          <Button color="secondary" className="w-fit" startContent={<FiEdit />}>
            Add picture
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <InputFile
                  onChange={(e) => {
                    onChange(e.target.files?.[0]);
                  }}
                />
              )}
            />
          </Button>
          {errors?.image?.message && (
            <ValidationErrorText>
              {errors?.image?.message as any}
            </ValidationErrorText>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <UserAutocomplete
            isScrollShadowEnabled={false}
            inputProps={{
              form: "cvcvcvcv",
            }}
            onItemClick={handleItemClick}
          />
          <UserGroupLists
            users={selectedUsers}
            onCloseClick={handleCloseClick}
          />
        </div>
        <InputWithControl
          label="Group title"
          placeholder="Enter new group title"
          control={control}
          name="title"
        />
        <TextareaWithControl
          label="Group description"
          placeholder="Enter new group description"
          control={control}
          name="description"
        />
      </form>
    </ModalLayoutV2>
  );
}
