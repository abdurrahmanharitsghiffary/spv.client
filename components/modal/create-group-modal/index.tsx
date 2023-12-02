"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useCreateGroupActions,
  useCreateGroupIsOpen,
} from "@/stores/create-group-store";
import { UserAccountPublic } from "@/types/user";
import UserAutocomplete from "@/components/user/user-autocomplete";
import { removeDuplicates } from "@/lib";
import UserChip from "@/components/user/user-chip";
import { getUserSimplified } from "@/lib/getUserSimplified";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zImage } from "@/lib/zod-schema/image";
import { Input } from "@nextui-org/input";
import ValidationErrorText from "@/components/validation-error-text";
import { Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FiPlus } from "react-icons/fi";
import InputFile from "@/components/input/file";
import { BsCardImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { useCreateGroupChat } from "@/lib/api/chats/mutation";

const createGroupSchema = z.object({
  participants: z
    .number()
    .array()
    .min(2, { message: "Must be at least 2 participant" }),
  title: z
    .string()
    .max(125, { message: "Title must be at least 125 characters or fewer" })
    .optional(),
  description: z.string().optional(),
  image: zImage.optional(),
});

type CreateGroupSchema = z.infer<typeof createGroupSchema>;

export default function CreateGroupModal() {
  const { createGroupChatAsync } = useCreateGroupChat();
  const {
    register,
    formState: { isSubmitSuccessful, errors },
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = useForm<CreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
  });
  const isOpen = useCreateGroupIsOpen();
  const { onClose } = useCreateGroupActions();

  const [selectedUsers, setSelectedUsers] = useState<UserAccountPublic[]>([]);

  const selectedUserIds = useMemo(
    () => selectedUsers.map((user) => user.id),
    [selectedUsers]
  );
  const handleReset = useCallback(() => {
    setSelectedUsers([]);
    reset();
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) handleClose();
  }, [isSubmitSuccessful]);

  useEffect(() => {
    setValue("participants", selectedUserIds);
  }, [selectedUserIds]);

  const handleItemClick = useCallback((item: UserAccountPublic) => {
    setSelectedUsers((v) => removeDuplicates([...v, item]).slice());
  }, []);

  const onSubmit: SubmitHandler<CreateGroupSchema> = async (data) => {
    console.log(data);
    await toast.promise(
      createGroupChatAsync({
        body: {
          image: data?.image,
          participants: data.participants,
          title: data?.title,
          description: data?.description,
        },
        formData: true,
      })
        .then((res) => res)
        .catch((err) => Promise.reject(err)),
      {
        success: "Group chat successfully created.",
        pending: "Creating group chat...",
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
  console.log(file, "File");
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
      <UserAutocomplete
        isScrollShadowEnabled={false}
        inputProps={{ variant: "bordered", radius: "full" }}
        onItemClick={handleItemClick}
      />
      <div className="flex gap-2 w-full flex-wrap">
        {selectedUsers?.map((user) => (
          <UserChip
            key={user?.id}
            onCloseClick={() => {
              setSelectedUsers((v) => v.filter((u) => u.id !== user.id));
            }}
            user={getUserSimplified(user)}
          >
            {user?.username}
          </UserChip>
        ))}
      </div>
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
          <Avatar
            fallback={
              <div className="p-4 w-[96px] h-[96px] aspect-square">
                <BsCardImage className="w-full h-full aspect-square" />
              </div>
            }
            src={groupPictureSrc}
            className="w-[120px] h-[120px] aspect-square"
          />
          <Button color="secondary" className="w-fit" startContent={<FiPlus />}>
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
        </div>
        <Input
          label="Group title (optional)"
          placeholder="Enter your group title"
          variant="bordered"
          isInvalid={errors?.title?.message !== undefined}
          errorMessage={errors?.title?.message}
          color={errors?.title?.message ? "danger" : "default"}
          {...register("title")}
        />
        <Input
          label="Group description (optional)"
          placeholder="Enter your group description"
          variant="bordered"
          isInvalid={errors?.description?.message !== undefined}
          errorMessage={errors?.description?.message}
          color={errors?.description?.message ? "danger" : "default"}
          {...register("description")}
        />
      </form>
    </ModalLayoutV2>
  );
}
