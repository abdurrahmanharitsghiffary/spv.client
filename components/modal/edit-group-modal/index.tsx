"use client";
import React, { useCallback, useEffect } from "react";
import ModalLayoutV2 from "../layoutV2";
import { UserAccountPublic } from "@/types/user";
import UserAutocomplete from "@/components/user/user-autocomplete";
import { removeDuplicates } from "@/lib";
import { getUserSimplified } from "@/lib/getUserSimplified";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zImage } from "@/lib/zod-schema/image";
import ValidationErrorText from "@/components/validation-error-text";
import { Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FiEdit } from "react-icons/fi";
import InputFile from "@/components/input/file";
import { BsCardImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { useUpdateGroupChatOptimistic } from "@/lib/api/chats/mutation";
import {
  useEditGroupActions,
  useEditGroupIsOpen,
} from "@/stores/edit-group-store";
import {
  InputWithControl,
  TextareaWithControl,
} from "@/components/form/input/input-with-control";
import { useGetChatRoomById } from "@/lib/api/chats/query";
import { useParams } from "next/navigation";
import UserGroupList from "@/components/user/user-group-list";
import { TypographyLarge } from "@/components/ui/typography";

const editGroupSchema = z.object({
  participants: z.any().array().optional(),
  title: z
    .string()
    .max(125, { message: "Title must be at least 125 characters or fewer" })
    .optional(),
  admin: z.number().array().optional(),
  description: z.string().optional(),
  image: zImage.optional(),
});

type EditGroupSchema = z.infer<typeof editGroupSchema>;

export default function EditGroupModal() {
  const { groupId } = useParams();
  const { chatRoom } = useGetChatRoomById(Number(groupId));
  const { updateGroupChatAsync } = useUpdateGroupChatOptimistic();
  const {
    formState: { isSubmitSuccessful, errors },
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = useForm<EditGroupSchema>({
    resolver: zodResolver(editGroupSchema),
    values: {
      participants: [],
      description: chatRoom?.data?.description ?? undefined,
      title: chatRoom?.data?.title ?? undefined,
    },
  });
  const selectedUsers = watch("participants");
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

  const onSubmit: SubmitHandler<EditGroupSchema> = async (data) => {
    await toast.promise(
      updateGroupChatAsync({
        body: {
          image: data?.image,
          participants: data?.participants ?? [],
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
  const groupPictureSrc = file ? URL.createObjectURL(file) : "";
  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={handleClose}
      footer={
        <Button type="submit" color="primary" form="create_group_form">
          Submit
        </Button>
      }
    >
      {errors?.participants?.message && (
        <ValidationErrorText>
          {errors?.participants?.message}
        </ValidationErrorText>
      )}
      <form
        className="p-4 px-0 flex flex-col gap-6 max-w-lg"
        id="create_group_form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-fit h-fit mx-auto flex flex-col gap-4 justify-center items-center">
          <TypographyLarge>Group picture</TypographyLarge>
          <Avatar
            fallback={
              <div className="p-4 w-[80px] h-[80px] aspect-square">
                <BsCardImage className="w-full h-full aspect-square" />
              </div>
            }
            src={groupPictureSrc}
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
          <ul className="w-full max-w-full grid grid-cols-1 gap-2">
            {(selectedUsers ?? []).map((user) => (
              <UserGroupList
                selectedUsers={selectedUsers}
                key={user.id}
                setValue={setValue}
                user={user as any}
              />
            ))}
          </ul>
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
