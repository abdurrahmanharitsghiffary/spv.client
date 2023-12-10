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
import { Avatar, Checkbox } from "@nextui-org/react";
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
              labelPlacement: "outside",
              variant: "faded",
              form: "cvcvcvcv",
            }}
            onItemClick={handleItemClick}
          />
          <div className="w-full max-w-full grid grid-cols-1 gap-2">
            {selectedUsers.map((user) => (
              <UserWithCheckbox
                selectedUsers={selectedUsers}
                key={user.id}
                setValue={setValue}
                user={user as any}
              />
            ))}
          </div>
        </div>

        {errors?.participants?.message && (
          <ValidationErrorText>
            {errors?.participants?.message}
          </ValidationErrorText>
        )}
        <Input
          variant="faded"
          label="Group title (optional)"
          placeholder="Enter your group title"
          isInvalid={errors?.title?.message !== undefined}
          errorMessage={errors?.title?.message}
          color={errors?.title?.message ? "danger" : "default"}
          {...register("title")}
        />
        <Textarea
          variant="faded"
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

function UserWithCheckbox({
  user,
  setValue,
  selectedUsers,
}: {
  user: UserSimplified & { role: "admin" | "user" };
  setValue: UseFormSetValue<{
    participants: any[];
  }>;
  selectedUsers: any;
}) {
  const handleRoleChange = () => {
    setValue(
      "participants",
      selectedUsers.map((item: UserSimplified & { role: "admin" | "user" }) => {
        if (item.id === user.id) {
          return { ...item, role: item.role === "user" ? "admin" : "user" };
        }
        return item;
      })
    );
  };

  const handleCloseClick = () => {
    setValue(
      "participants",
      selectedUsers.filter((item: any) => item.id !== user.id)
    );
  };

  return (
    <div className="flex gap-2 justify-between items-center pl-2">
      <UserCard
        user={user}
        hideLink
        withFollowButton={false}
        className="shadow-none rounded-none px-0"
        cardClassNames={{ body: "!px-0" }}
      />
      <Button
        variant={user.role === "admin" ? "flat" : "faded"}
        color={user.role === "user" ? "default" : "success"}
        size="sm"
        endContent={
          user.role === "admin" && (
            <div className="text-[0.875rem]">
              <FiCheck />
            </div>
          )
        }
        onClick={handleRoleChange}
        className={clsx("capitalize", user.role === "admin" && "px-6")}
      >
        Admin
      </Button>
      <IconButton
        size="sm"
        color="danger"
        variant="flat"
        onClick={handleCloseClick}
      >
        <FiTrash size={16} />
      </IconButton>
    </div>
  );
}
