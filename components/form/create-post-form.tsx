"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TypographyH3, TypographyH4, TypographyMuted } from "../ui/typography";
import { Button } from "@nextui-org/button";
import PostCard from "../post/post-card";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePostValidationSchema,
  createPostValidationSchema,
} from "@/lib/zod-schema/post";
import CreatePostImageChip from "./create-post-image-chip";
import { PostExtended } from "@/types/post";
import { useCreatePost } from "@/lib/api/posts/mutation";
import { toast } from "react-toastify";
import clsx from "clsx";
import FileButton from "../input/file-btn";
import {
  InputWithControl,
  TextareaWithControl,
} from "../input/input-with-control";
import { Checkbox } from "@nextui-org/checkbox";

export default function CreatePostForm({
  withPreview = true,
  isNotPostPage = false,
  className,
  autoFocus,
}: {
  autoFocus?: boolean;
  withPreview?: boolean;
  isNotPostPage?: boolean;
  className?: string;
}) {
  const [isShowPreview, setIsShowPreview] = useState(true);
  const { createPostAsync } = useCreatePost();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreatePostValidationSchema>({
    defaultValues: { images: [], content: "", title: "" },
    resolver: zodResolver(createPostValidationSchema),
  });

  const images: File[] = useWatch({ control, name: "images" });
  const title = useWatch({ control, name: "title" });
  const content = useWatch({ control, name: "content" });
  console.log(images, "Images");
  const postsImages: { src: string }[] = useMemo(() => {
    return images.map((image) => ({
      src: URL.createObjectURL(image),
    }));
  }, [images]);

  const onSubmit: SubmitHandler<CreatePostValidationSchema> = (data) =>
    toast.promise(createPostAsync({ data }), {
      success: {
        render({ data }) {
          return "Post successfully created";
        },
      },
      pending: "Creating your post... please wait",
      error: {
        render({ data }) {
          return (data as any)?.message ?? "Something went wrong!";
        },
        autoClose: 1500,
      },
    });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const post = useMemo(() => {
    return {
      title,
      content,
      author: {
        id: 99,
        image: null,
        username: "John Doe",
      },
      createdAt: new Date("2023"),
      images: postsImages,
    };
  }, [postsImages, title, content]);

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
    <>
      <form
        className={clsx("w-full flex flex-col gap-2 p-4 pt-8", className)}
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        {!isNotPostPage && (
          <TypographyH3 className="!text-lg">Post your thought</TypographyH3>
        )}
        <InputWithControl
          disableAnimation
          maxLength={40}
          placeholder="Write your post title"
          label="Title"
          control={control}
          name="title"
        />
        <div className="w-full relative pb-12">
          <TextareaWithControl
            disableAnimation
            autoFocus={autoFocus}
            minRows={4}
            maxRows={5}
            placeholder="Write your thought..."
            classNames={{
              errorMessage: "absolute pl-2 z-[11]",
              helperWrapper: "pt-0",
              inputWrapper:
                "rounded-none !rounded-t-medium focus:rounded-medium",
            }}
            control={control}
            name="content"
          />
          <ul className="absolute bg-default-100 border-t-1 border-divider bottom-1 rounded-b-medium flex inset-x-0 justify-end p-1 w-full">
            <li className="relative w-fit">
              <Controller
                control={control}
                name="images"
                render={({ field: { onChange } }) => (
                  <FileButton
                    color="secondary"
                    inputProps={{ id: "file_input" }}
                    radius="full"
                    variant="light"
                    inputClassName="opacity-0 z-[10] absolute inset-0"
                    onChange={(e) => {
                      onChange(Array.from(e?.target?.files ?? []));
                      e.target.value = "";
                    }}
                    multiple={true}
                  />
                )}
              />
            </li>
          </ul>
        </div>

        {(images ?? []).length > 0 && (
          <div className="w-full flex flex-col gap-2 ">
            <TypographyMuted>
              {images?.length} Image{(images ?? []).length > 1 && "s"} choosen
            </TypographyMuted>
            <CreatePostImageChip
              images={images}
              onCloseClick={handleCloseClick}
            />
            {errors.images?.message ? (
              <TypographyMuted className="text-danger text-tiny">
                {errors.images.message as string}
              </TypographyMuted>
            ) : (
              ""
            )}
          </div>
        )}
        <div className="flex gap-2 items-center w-full justify-end">
          {(title || (images?.length ?? 0) > 0 || content) && (
            <Button type="button" color="default" onClick={() => reset()}>
              Cancel
            </Button>
          )}
          <Button type="submit" color="primary">
            Create Post
          </Button>
        </div>

        {/* {!isNotPostPage && (
          <Button
            type="submit"
            color="primary"
            className="fixed top-[12px] right-4 z-[41]"
          >
            Create Post
          </Button>
        )} */}
      </form>
      <Checkbox
        isSelected={isShowPreview}
        onValueChange={setIsShowPreview}
        className="self-start !pb-5 px-6"
      >
        {isShowPreview ? "Hide preview" : "Show preview"}
      </Checkbox>
      {isShowPreview && withPreview && (
        <div className="w-full flex flex-col gap-2 pb-16">
          <TypographyH4 className="px-4 !text-base">Preview</TypographyH4>
          <PostCard
            shadow="none"
            radius="none"
            isPreview
            className={`rounded-none w-full`}
            post={post as unknown as PostExtended}
          />
        </div>
      )}
    </>
  );
}

{
  /* <Button
                color="secondary"
                isIconOnly
                variant="light"
                radius="full"
              >
                <BsCardImage />
                <Controller
                  control={control}
                  name="images"
                  render={({ field: { onChange } }) => (
                    <>
                    <FileButton color="secondary" inputProps={{id:"file_input"}} radius="full" variant="light" inputClassName="opacity-0 z-[10] absolute inset-0" onChange={(e) => {
                        onChange(Array.from(e?.target?.files ?? []));
                      }} multiple={true}/>
                     <input
                      className=""
                      type="file"
                      id="file_input"
                      onChange={}
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      multiple={true}
                    />
                    </>
                   
                  )}
                />
              </Button> */
}
