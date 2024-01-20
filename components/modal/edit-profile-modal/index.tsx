"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { useEditProfileControls } from "@/hooks/use-edit-profile";
import { Button } from "@nextui-org/button";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetMyAccountInfo } from "@/lib/api/account/query";
import {
  useUpdateMyAccountImage,
  useUpdateMyAccountInfo,
  useUpdateMyCoverImage,
} from "@/lib/api/account/mutation";
import { toast } from "react-toastify";
import { Avatar } from "@nextui-org/avatar";
import CoverImage from "@/components/image/cover-image";
import { TypographyH4 } from "@/components/ui/typography";
import { AiOutlineEdit } from "react-icons/ai";
import ModalLayoutV2 from "../layoutV2";
import {
  EditProfileValidationSchema,
  editProfileValidationSchema,
} from "@/lib/zod-schema/user";
import ValidationErrorText from "@/components/validation-error-text";
import GenderSelect from "@/components/gender-select";
import InputFile from "@/components/input/file";
import {
  InputWithControl,
  TextareaWithControl,
} from "@/components/input/input-with-control";
import { DISCARD_CHANGE_CONFIRM_PROPS, saveChangesProps } from "@/lib/consts";
import { useConfirm } from "@/stores/confirm-store";
import CancelButton from "@/components/button/reset-button";

export default function EditProfileModal() {
  const confirm = useConfirm();
  const { updateAccountImageAsync } = useUpdateMyAccountImage();
  const { updateCoverImageAsync } = useUpdateMyCoverImage();
  const { updateAccountAsync } = useUpdateMyAccountInfo();
  const { resp, isSuccess } = useGetMyAccountInfo();

  const {
    handleSubmit,
    reset,
    control,
    formState: {
      isSubmitSuccessful,
      errors: { gender, profileImage: pIErr, coverImage: cIErr },
    },
  } = useForm<EditProfileValidationSchema>({
    resolver: zodResolver(editProfileValidationSchema),
    defaultValues: {
      bio: "",
      coverImage: null,
      firstName: "",
      gender: "not_say",
      lastName: "",
      profileImage: null,
      username: "",
    },
    values: {
      firstName: resp?.data?.firstName ?? "",
      lastName: resp?.data?.lastName ?? "",
      username: resp?.data?.username ?? "",
      bio: resp?.data?.profile?.description ?? "",
      gender: resp?.data?.profile?.gender ?? "not_say",
    },
  });
  useEffect(() => {
    if (isSuccess) reset();
  }, [isSuccess]);
  const profileImage = useWatch({ control, name: "profileImage" });
  const coverImage = useWatch({ control, name: "coverImage" });

  const { onClose, isOpen } = useEditProfileControls();
  const onSubmit: SubmitHandler<EditProfileValidationSchema> = async (data) => {
    await confirm(saveChangesProps("profile"));
    await toast.promise(
      updateAccountAsync({
        body: {
          gender: data?.gender === "not_say" ? null : data?.gender,
          firstName: data?.firstName,
          lastName: data?.lastName,
          username: data?.username,
          description: data?.bio,
        },
      }),
      {
        error: {
          render(props) {
            return "Something went wrong!";
          },
        },
        pending: "Processing data, please wait...",
        success: "Profile successfully edited",
      },
      {
        autoClose: 1200,
        hideProgressBar: true,
      }
    );

    if (data?.profileImage) {
      await updateAccountImageAsync({
        body: { image: data.profileImage },
        formData: true,
      });
    }
    if (data?.coverImage) {
      await updateCoverImageAsync({
        formData: true,
        body: { image: data.coverImage },
      });
    }
  };

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) {
      handleClose();
    }
  }, [isSubmitSuccessful]);

  const profileImageSource = useMemo(
    () =>
      profileImage
        ? URL.createObjectURL(profileImage)
        : resp?.data?.profile?.avatarImage?.src,
    [resp?.data?.profile?.avatarImage?.src, profileImage]
  );

  const coverImageSource = useMemo(
    () =>
      coverImage
        ? URL.createObjectURL(coverImage)
        : resp?.data?.profile?.coverImage?.src ?? "",
    [coverImage, resp?.data?.profile?.coverImage?.src]
  );

  const handleCancel = async () => {
    await confirm(DISCARD_CHANGE_CONFIRM_PROPS);
    reset();
  };

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={handleClose}
      footer={
        <div className="flex gap-2 justify-center items-center">
          <CancelButton onReset={reset} />
          <Button color="primary" form="edit-profile-form" type="submit">
            Save changes
          </Button>
        </div>
      }
    >
      <form
        className="p-4 px-0 flex flex-col gap-6 max-w-lg"
        id="edit-profile-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-4 items-center">
            <TypographyH4>Profile picture</TypographyH4>
            <Avatar isBordered src={profileImageSource} className="w-32 h-32" />
            {pIErr?.message && (
              <ValidationErrorText>
                {pIErr?.message.toString()}
              </ValidationErrorText>
            )}
            <Button
              color="secondary"
              className="w-fit"
              startContent={<AiOutlineEdit />}
            >
              Edit
              <Controller
                name="profileImage"
                control={control}
                render={({ field: { onChange } }) => (
                  <InputFile
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                )}
              />
            </Button>
          </div>

          <div className="w-full flex flex-col gap-4">
            <TypographyH4>Cover image</TypographyH4>
            <CoverImage
              className="max-w-lg rounded-medium"
              src={coverImageSource}
            />
            {cIErr?.message && (
              <ValidationErrorText>
                {cIErr?.message.toString()}
              </ValidationErrorText>
            )}
            <Button
              color="secondary"
              className="w-fit"
              startContent={<AiOutlineEdit />}
            >
              Edit
              <Controller
                name="coverImage"
                control={control}
                render={({ field: { onChange } }) => (
                  <InputFile
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                )}
              />
            </Button>
          </div>
        </div>
        <InputWithControl
          label="Username"
          type="text"
          control={control}
          name="username"
          placeholder="Enter your new username"
        />
        <InputWithControl
          label="Firstname"
          type="text"
          control={control}
          name="firstName"
          placeholder="Enter your new firstname"
        />
        <InputWithControl
          label="Lastname"
          type="text"
          control={control}
          name="lastName"
          placeholder="Enter your new lastname"
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <GenderSelect
              variant="flat"
              onChange={(e) => onChange(e.target.value)}
              value={value ?? "not_say"}
              message={gender?.message}
            />
          )}
        />
        <TextareaWithControl
          maxRows={4}
          minRows={2}
          label="Bio"
          control={control}
          name="bio"
          // isInvalid={bio?.message !== undefined}
          // errorMessage={bio?.message}
          // color={bio?.message ? "danger" : "default"}
          // {...register("bio")}
          placeholder="Enter your new bio"
        />
      </form>
    </ModalLayoutV2>
  );
}
