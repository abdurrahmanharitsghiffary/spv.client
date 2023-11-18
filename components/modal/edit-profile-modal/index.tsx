"use client";
import React, { useEffect } from "react";
import { useEditProfileControls } from "@/hooks/use-edit-profile";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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

export default function EditProfileModal() {
  const { updateAccountImageAsync } = useUpdateMyAccountImage();
  const { updateCoverImageAsync } = useUpdateMyCoverImage();
  const { updateAccountAsync } = useUpdateMyAccountInfo();
  const { myAccountInfo } = useGetMyAccountInfo();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    control,
    formState: {
      isSubmitSuccessful,
      errors: {
        bio,
        lastName,
        firstName,
        gender,
        username,
        profileImage: pIErr,
        coverImage: cIErr,
      },
    },
  } = useForm<EditProfileValidationSchema>({
    resolver: zodResolver(editProfileValidationSchema),
    values: {
      firstName: myAccountInfo?.data?.firstName,
      lastName: myAccountInfo?.data?.lastName,
      username: myAccountInfo?.data?.username,
      bio: myAccountInfo?.data?.profile?.description ?? "",
      gender: myAccountInfo?.data?.profile?.gender ?? "not_say",
    },
  });

  const profileImage = watch("profileImage");
  const coverImage = watch("coverImage");

  const disclosure = useEditProfileControls();
  const onSubmit: SubmitHandler<EditProfileValidationSchema> = async (data) => {
    await toast.promise(
      updateAccountAsync({
        data: {
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
      await updateAccountImageAsync({ image: data.profileImage });
    }
    if (data?.coverImage) {
      await updateCoverImageAsync({ image: data.coverImage });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      disclosure.onClose();
    }
  }, [isSubmitSuccessful]);

  return (
    <ModalLayoutV2
      isOpen={disclosure.isOpen}
      onClose={() => {
        disclosure.onClose();
        reset();
      }}
      footer={
        <div className="flex gap-2 justify-center items-center">
          <Button onClick={() => reset()}>Cancel</Button>
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
            <Avatar
              name={myAccountInfo?.data?.username}
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : myAccountInfo?.data?.profile?.image?.src
              }
              className="w-32 h-32"
            />
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
              src={
                coverImage
                  ? URL.createObjectURL(coverImage)
                  : myAccountInfo?.data?.profile?.coverImage?.src ?? ""
              }
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
                    }}
                  />
                )}
              />
            </Button>
          </div>
        </div>
        <Input
          label="Username"
          type="text"
          variant="bordered"
          isInvalid={username?.message !== undefined}
          errorMessage={username?.message}
          color={username?.message ? "danger" : "default"}
          {...register("username")}
          placeholder="Enter your new username"
        />
        <Input
          variant="bordered"
          label="Firstname"
          type="text"
          isInvalid={firstName?.message !== undefined}
          errorMessage={firstName?.message}
          color={firstName?.message ? "danger" : "default"}
          {...register("firstName")}
          placeholder="Enter your new firstname"
        />
        <Input
          variant="bordered"
          label="Lastname"
          type="text"
          isInvalid={lastName?.message !== undefined}
          errorMessage={lastName?.message}
          color={lastName?.message ? "danger" : "default"}
          {...register("lastName")}
          placeholder="Enter your new lastname"
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <GenderSelect
              onChange={(e) => onChange(e.target.value)}
              value={value ?? "not_say"}
              message={gender?.message}
            />
          )}
        />
        <Textarea
          variant="bordered"
          maxRows={4}
          minRows={2}
          label="Bio"
          isInvalid={bio?.message !== undefined}
          errorMessage={bio?.message}
          color={bio?.message ? "danger" : "default"}
          {...register("bio")}
          placeholder="Enter your new bio"
        />
      </form>
    </ModalLayoutV2>
  );
}
// <ModalLayout
//       scrollBehavior="inside"
//       onClose={() => {
//         disclosure.onClose();
//         reset();
//       }}
//       header={<Divider className="w-full" />}
//       classNames={{
//         wrapper: "min-h-screen",
//         header: "p-0 h-[100px] items-end ",
//         footer: "p-4",
//       }}
//       wrapperClassNames={{
//         wrapper: "z-[100]",
//         closeButton: "left-2 top-[12px]",
//       }}
//       closeButton={
//         <IconButton>
//           <BiChevronLeft />
//         </IconButton>
//       }
//       isOpen={disclosure.isOpen}
//       placement="center"
//       size="full"
//       footer={
//         <div className="flex gap-2 justify-center items-center">
//           <Button onClick={() => reset()}>Cancel</Button>
//           <Button color="primary" form="edit-profile-form" type="submit">
//             Save changes
//           </Button>
//         </div>
//       }
//       //   header={<TypographyH4>Edit profile information</TypographyH4>}
//     >
//       <form
//         className="p-4 px-0 flex flex-col gap-6 max-w-lg"
//         id="edit-profile-form"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="w-full flex flex-col gap-4">
//           <div className="flex flex-col gap-2">
//             <div className="w-full flex gap-2 items-center">
//               <TypographyH4>Profile picture</TypographyH4>
//               <IconButton className="relative">
//                 <AiOutlineEdit />
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/jpg,image/png"
//                   onChange={(e) => {
//                     setProfileImage((c) => e.target?.files?.[0] ?? null);
//                   }}
//                   className="absolute inset-0 opacity-0"
//                 />
//               </IconButton>
//             </div>

//             <Avatar
//               name={myAccountInfo?.data?.username}
//               src={
//                 profileImage
//                   ? URL.createObjectURL(profileImage)
//                   : myAccountInfo?.data?.profile?.image?.src
//               }
//               className="w-32 h-32"
//             />
//           </div>

//           <div className="w-full flex flex-col gap-2">
//             <div className="w-full flex gap-2 items-center">
//               <TypographyH4>Cover image</TypographyH4>
//               <IconButton className="relative">
//                 <AiOutlineEdit />
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/jpg,image/png"
//                   onChange={(e) => {
//                     setCoverImage((c) => e.target?.files?.[0] ?? null);
//                   }}
//                   className="absolute inset-0 opacity-0"
//                 />
//               </IconButton>
//             </div>
//             <CoverImage
//               className="max-w-lg"
//               src={
//                 coverImage
//                   ? URL.createObjectURL(coverImage)
//                   : myAccountInfo?.data?.profile?.coverImage?.src ?? ""
//               }
//             />
//           </div>
//         </div>
//         <Input
//           label="Username"
//           type="text"
//           isInvalid={username?.message !== undefined}
//           errorMessage={username?.message}
//           color={username?.message ? "danger" : "default"}
//           {...register("username")}
//           placeholder="Enter your new username"
//         />
//         <Input
//           label="Firstname"
//           type="text"
//           isInvalid={firstName?.message !== undefined}
//           errorMessage={firstName?.message}
//           color={firstName?.message ? "danger" : "default"}
//           {...register("firstName")}
//           placeholder="Enter your new firstname"
//         />
//         <Input
//           label="Lastname"
//           type="text"
//           isInvalid={lastName?.message !== undefined}
//           errorMessage={lastName?.message}
//           color={lastName?.message ? "danger" : "default"}
//           {...register("lastName")}
//           placeholder="Enter your new lastname"
//         />
//         <Textarea
//           maxRows={4}
//           minRows={2}
//           label="Bio"
//           isInvalid={bio?.message !== undefined}
//           errorMessage={bio?.message}
//           color={bio?.message ? "danger" : "default"}
//           {...register("bio")}
//           placeholder="Enter your new bio"
//         />
//       </form>
//     </ModalLayout>
