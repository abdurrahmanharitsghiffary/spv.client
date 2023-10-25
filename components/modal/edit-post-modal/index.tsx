"use client";
import React, { useEffect } from "react";
import ModalLayout from "../layout";
import {
  useGetSelectedPostId,
  useShowEditPostDisclosure,
} from "@/hooks/useEditPost";
import { Input, Textarea } from "@nextui-org/input";
import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/createPostSchema";
import { formatBytes } from "@/lib/formatBytes";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { BsCardImage } from "react-icons/bs";
import { useUpdatePost } from "@/lib/api/posts/mutation";
import CreatePostImageChip from "@/components/form/create-post-image-chip";
import { useGetPostById } from "@/lib/api/posts/query";
import { TypographyMuted } from "@/components/ui/typography";
import IconButton from "@/components/button/icon-button";
import { BiChevronLeft } from "react-icons/bi";
import { Divider } from "@nextui-org/divider";

const updatePostSchema = z.object({
  title: z.string().max(40, { message: "Title is to long" }).optional(),
  content: z.string().optional(),
  images: z
    .any()
    .refine(
      (files) => files instanceof FileList || files instanceof Array,
      "Invalid field value."
    )
    .refine(
      (files) =>
        Array.from((files as FileList) ?? []).every(
          (file: File) => file.size <= MAX_FILE_SIZE
        ),
      `Max file size of each images is ${formatBytes(MAX_FILE_SIZE, "mb")}Mb.`
    )
    .refine(
      (files) =>
        Array.from((files as FileList) ?? []).every((file: File) =>
          ACCEPTED_IMAGE_TYPES.includes(file?.type)
        ),
      ".jpg, .jpeg, .png files are accepted."
    )
    .optional(),
});

type UpdatePostSchema = z.infer<typeof updatePostSchema>;

export default function EditPostModal() {
  const postId = useGetSelectedPostId();
  const { post } = useGetPostById(postId);
  const {
    watch,
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {
      errors: { content, images: imagesErrors, title },
      isSubmitSuccessful,
    },
  } = useForm<UpdatePostSchema>({
    resolver: zodResolver(updatePostSchema),
    values: {
      content: post?.data?.content ?? "",
      title: post?.data?.title ?? "",
      images: [],
    },
  });
  const images = watch("images") ?? [];
  const { updatePostAsync } = useUpdatePost();

  const { isOpen, onClose } = useShowEditPostDisclosure();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<UpdatePostSchema> = async (data) => {
    await updatePostAsync({ postId, data });
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      header={<Divider className="w-full" />}
      classNames={{
        wrapper: "h-full",
        header: "p-0 h-[64px] items-end",
        footer: "p-4",
      }}
      wrapperClassNames={{
        closeButton: "left-2 top-[12px]",
      }}
      closeButton={
        <IconButton>
          <BiChevronLeft />
        </IconButton>
      }
      size="full"
      placement="center"
      footer={
        <div className="flex gap-2">
          <Button onClick={() => reset()}>Cancel</Button>
          <Button type="submit" form="edit-post-form" color="primary">
            Save changes
          </Button>
        </div>
      }
    >
      <form
        encType="multiform/data"
        className="p-4 px-0 flex flex-col gap-4 w-full"
        id="edit-post-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Title"
          isInvalid={title?.message ? true : false}
          errorMessage={title?.message}
          color={title?.message ? "danger" : "default"}
          placeholder="Enter your new title..."
          {...register("title")}
        />
        <Textarea
          isInvalid={content?.message ? true : false}
          color={content?.message ? "danger" : "default"}
          errorMessage={content?.message}
          minRows={4}
          maxRows={5}
          placeholder="Write your new thought..."
          {...register("content")}
        />
        {imagesErrors?.message && (
          <TypographyMuted className="text-danger !text-[12px]">
            {imagesErrors?.message.toString()}
          </TypographyMuted>
        )}
        <CreatePostImageChip
          images={images}
          onCloseClick={setValue}
          className="!flex-wrap"
        />
        <Button
          color="secondary"
          startContent={<BsCardImage />}
          className="w-fit"
        >
          Add new images
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange } }) => (
              <input
                className="opacity-0 z-[10] absolute inset-0"
                type="file"
                id="edit_post_images"
                onChange={(e) => {
                  onChange(Array.from(e?.target?.files ?? []));
                }}
                accept="image/png,image/jpg,image/jpeg"
                multiple={true}
              />
            )}
          />
        </Button>
      </form>
    </ModalLayout>
  );
}
