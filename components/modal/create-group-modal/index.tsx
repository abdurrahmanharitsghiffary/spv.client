"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useCreateGroupActions,
  useCreateGroupIsOpen,
} from "@/stores/create-group-store";
import { UserAccountPublic, UserSimplified } from "@/types/user";
import UserAutocomplete from "@/components/user/user-autocomplete";
import { removeDuplicates } from "@/lib";
import UserChip from "@/components/user/user-chip";
import { getUserSimplified } from "@/lib/getUserSimplified";
import {
  useForm,
  SubmitHandler,
  Controller,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zImage } from "@/lib/zod-schema/image";
import { Input, Textarea } from "@nextui-org/input";
import ValidationErrorText from "@/components/validation-error-text";
import { Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FiCheck, FiPlus, FiTrash, FiX } from "react-icons/fi";
import InputFile from "@/components/input/file";
import { BsCardImage } from "react-icons/bs";
import { toast } from "react-toastify";
import { useCreateGroupChat } from "@/lib/api/chats/mutation";
import UserCard from "@/components/user/user-card";
import IconButton from "@/components/button/icon-button";
import { TypographyLarge } from "@/components/ui/typography";
import clsx from "clsx";
import UserGroupList from "@/components/user/user-group-list";

const createGroupSchema = z.object({
  participants: z
    .any()
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
    reset,
  } = useForm<CreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
  });
  const isOpen = useCreateGroupIsOpen();
  const { onClose } = useCreateGroupActions();
  const watch = useWatch({ control, defaultValue: { participants: [] } });
  const selectedUsers = watch.participants ?? [];
  console.log(selectedUsers, "selu");

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
      console.log(item, "ITEM");

      const values = removeDuplicates([
        ...(selectedUsers ?? []),
        { ...getUserSimplified(item), role: "user" },
      ]);
      console.log(values, "Values");
      setValue("participants", values.slice());
    },
    [selectedUsers]
  );

  const onSubmit: SubmitHandler<CreateGroupSchema> = async (data) => {
    console.log("IS SUBMITTEd");
    const participants = data.participants.map((participant) => ({
      id: participant.id,
      role: participant.role,
    }));
    console.log(participants, "parti");
    await toast.promise(
      createGroupChatAsync({
        body: {
          image: data?.image,
          participants: participants,
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

  const file = watch.image;
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
      <form
        className="p-4 px-0 flex flex-col gap-6 max-w-lg"
        id="create_group_form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-fit h-fit mx-auto flex flex-col gap-4 justify-center items-center">
          <TypographyLarge>Group picture</TypographyLarge>
          <Avatar
            fallback={
              <div className="p-4 w-[60px] h-[60px] aspect-square">
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
            {selectedUsers.map((user) => (
              <UserGroupList
                selectedUsers={selectedUsers}
                key={user.id}
                setValue={setValue}
                user={user as any}
              />
            ))}
          </ul>
        </div>

        {errors?.participants?.message && (
          <ValidationErrorText>
            {errors?.participants?.message}
          </ValidationErrorText>
        )}
        <Input
          label="Group title (optional)"
          placeholder="Enter your group title"
          isInvalid={errors?.title?.message !== undefined}
          errorMessage={errors?.title?.message}
          color={errors?.title?.message ? "danger" : "default"}
          {...register("title")}
        />
        <Textarea
          label="Group description (optional)"
          placeholder="Enter your group description"
          isInvalid={errors?.description?.message !== undefined}
          errorMessage={errors?.description?.message}
          color={errors?.description?.message ? "danger" : "default"}
          {...register("description")}
        />
      </form>
    </ModalLayoutV2>
  );
}
