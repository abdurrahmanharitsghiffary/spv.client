"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useCreateGroupActions,
  useCreateGroupIsOpen,
} from "@/stores/create-group-store";
import { UserAccountPublic, UserGroup } from "@/types/user";
import UserAutocomplete from "@/components/user/user-autocomplete";
import { removeDuplicates } from "@/lib";
import { getUserSimplified } from "@/lib/getUserSimplified";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zImage } from "@/lib/zod-schema/image";
import ValidationErrorText from "@/components/validation-error-text";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { FiPlus } from "react-icons/fi";
import InputFile from "@/components/input/file";
import { toast } from "react-toastify";
import { useCreateGroupChat } from "@/lib/api/chats/mutation";
import { TypographyLarge } from "@/components/ui/typography";
import {
  InputWithControl,
  TextareaWithControl,
} from "@/components/input/input-with-control";
import UserGroupLists from "@/components/user/user-group-lists";
import { MdGroup } from "react-icons/md";
import { zApplyType, zGroupVisibility } from "@/lib/zod-schema";
import GroupVisibility from "@/components/input/group-visibility";
import ApplicationType from "@/components/input/application-type";

const createGroupSchema = z.object({
  participants: z
    .any({ required_error: "Participants must not be empty" })
    .array()
    .min(2, { message: "Must be at least 2 participants" }),
  title: z
    .string()
    .max(125, { message: "Title must be at least 125 characters or fewer" })
    .optional(),
  description: z.string().optional(),
  image: zImage.optional(),
  applyType: zApplyType.optional(),
  groupVisibility: zGroupVisibility.optional(),
});

type CreateGroupSchema = z.infer<typeof createGroupSchema>;

export default function CreateGroupModal() {
  const { createGroupChatAsync } = useCreateGroupChat();
  const {
    formState: { isSubmitSuccessful, errors, isSubmitting },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<CreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      description: "",
      image: null,
      participants: [],
      title: "",
    },
  });
  const isOpen = useCreateGroupIsOpen();
  const { onClose } = useCreateGroupActions();
  const watch = useWatch({ control, defaultValue: { participants: [] } });
  const selectedUsers = watch.participants ?? [];
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
      const values = removeDuplicates([
        ...(selectedUsers ?? []),
        { ...getUserSimplified(item), role: "user" },
      ]);
      setValue("participants", values.slice());
    },
    [selectedUsers]
  );

  const onSubmit: SubmitHandler<CreateGroupSchema> = async (data) => {
    if (isSubmitting) return null;
    const participants = data.participants.map((participant) => ({
      id: participant.id,
      role: participant.role,
    }));
    await toast.promise(
      createGroupChatAsync({
        body: {
          applyType: data?.applyType,
          groupVisibility: data.groupVisibility,
          image: data?.image,
          participants: participants,
          title: data?.title,
          description: data?.description,
        },
        formData: true,
      }),
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
  const groupPictureSrc = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file]
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
            fallback={<MdGroup size={40} />}
            src={groupPictureSrc}
            showFallback
            isBordered
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
          <UserGroupLists
            users={selectedUsers}
            onCloseClick={handleCloseClick}
          />
        </div>

        {errors?.participants?.message && (
          <ValidationErrorText>
            {errors?.participants?.message}
          </ValidationErrorText>
        )}
        <InputWithControl
          label="Group title (optional)"
          placeholder="Enter your group title"
          control={control}
          name="title"
        />
        <TextareaWithControl
          label="Group description (optional)"
          placeholder="Enter your group description"
          control={control}
          name="description"
        />
        <GroupVisibility control={control} name="groupVisibility" />
        <ApplicationType control={control} name="applyType" />
      </form>
    </ModalLayoutV2>
  );
}
