"use client";
import React, { useCallback, useEffect } from "react";
import ModalLayout from "../layout";
import {
  useGetSelectedPostId,
  useShowEditPostDisclosure,
} from "@/hooks/use-edit-post";
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
import { UpdatePostSchema, updatePostSchema } from "@/lib/zod-schema/post";
import InputFile from "@/components/input/file";
import {
  InputWithControl,
  TextareaWithControl,
} from "@/components/input/input-with-control";
import ModalLayoutV2 from "../layoutV2";
import { useConfirm } from "@/stores/confirm-store";
import { DISCARD_CHANGE_CONFIRM_PROPS, saveChangesProps } from "@/lib/consts";
import CancelButton from "@/components/button/reset-button";

function EditPostModal() {
  const confirm = useConfirm();
  const postId = useGetSelectedPostId();
  const { post } = useGetPostById(postId);
  const {
    watch,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: {
      errors: { images: imagesErrors },
      isSubmitSuccessful,
    },
  } = useForm<UpdatePostSchema>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: { content: "", images: [], title: "" },
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
    await confirm(saveChangesProps("post"));
    await updatePostAsync({ params: { postId }, body: data, formData: true });
  };

  const handleCloseClick = useCallback(
    (image: File) => {
      if (!images) return null;
      const files = (images as File[]).filter(
        (img) =>
          !`${img.name}${img.size}${image.type}`.includes(
            `${image.name}${image.size}${image.type}`
          )
      );
      setValue("images", [...files]);
    },
    [images]
  );

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <div className="flex gap-2">
          <CancelButton onReset={reset} />
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
        <InputWithControl
          label="Title"
          placeholder="Enter your new title..."
          control={control}
          name="title"
        />
        <TextareaWithControl
          minRows={4}
          maxRows={5}
          placeholder="Write your new thought..."
          control={control}
          name="content"
        />
        {imagesErrors?.message && (
          <TypographyMuted className="text-danger !text-[0.75rem]">
            {imagesErrors?.message.toString()}
          </TypographyMuted>
        )}
        <CreatePostImageChip
          images={images}
          onCloseClick={handleCloseClick}
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
              <InputFile
                className="opacity-0 z-[10] absolute inset-0"
                id="edit_post_images"
                onChange={(e) => {
                  console.log(e.target.files, "FileList");
                  const files: File[] = [];
                  Array.from(e.target?.files ?? []).forEach((img) => {
                    files.push(img);
                  });
                  console.log(files, "Files");
                  onChange(files);
                }}
                multiple={true}
              />
            )}
          />
        </Button>
      </form>
    </ModalLayoutV2>
  );
}

export default EditPostModal;
