"use client";
import React, { useEffect, useMemo } from "react";
import { TypographyH4, TypographyMuted } from "../ui/typography";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { BsCardImage } from "react-icons/bs";
import PostCard from "../post/post-card";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePostValidationSchema,
  createPostValidationSchema,
} from "@/lib/createPostSchema";
import CreatePostImageChip from "./create-post-image-chip";
import { PostExtended } from "@/types/post";
import { useCreatePost } from "@/lib/api/posts/mutation";
import { toast } from "react-toastify";
import clsx from "clsx";

export default function CreatePostForm({
  withPreview = true,
  isNotPostPage = false,
  className,
}: {
  withPreview?: boolean;
  isNotPostPage?: boolean;
  className?: string;
}) {
  const { createPostAsync } = useCreatePost();
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreatePostValidationSchema>({
    defaultValues: { images: [] },
    resolver: zodResolver(createPostValidationSchema),
  });

  const images: FileList | null = watch("images");
  const postsImages: { src: string }[] | null = useMemo(() => {
    if (images === null) return null;
    return (Array.from(images ?? []) ?? []).map((image) => ({
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
      title: watch("title"),
      content: watch("content"),
      author: {
        id: 99,
        image: null,
        username: "John Doe",
      },
      createdAt: new Date("2023"),
      images: postsImages,
    };
  }, [postsImages, watch("content"), watch("title")]);

  return (
    <>
      <form
        className={clsx("w-full flex flex-col gap-2 p-4 pt-8", className)}
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        {!isNotPostPage && <TypographyH4>Create a new post</TypographyH4>}
        <Input
          maxLength={40}
          isInvalid={errors.title?.message !== undefined}
          errorMessage={errors.title?.message}
          color={errors.title?.message ? "danger" : "default"}
          placeholder="Write your post title"
          label="Title"
          {...register("title")}
        />
        <div className="w-full relative pb-12">
          <Textarea
            isInvalid={errors.content?.message !== undefined}
            errorMessage={errors.content?.message}
            color={errors.content?.message ? "danger" : "default"}
            autoFocus
            minRows={4}
            maxRows={5}
            placeholder="Write your thought..."
            classNames={{
              errorMessage: "absolute pl-2 z-[11]",
              helperWrapper: "pt-0",
              inputWrapper: "rounded-none !rounded-t-medium",
            }}
            {...register("content")}
          />
          <ul className="absolute bg-default-100 border-t-1 border-divider bottom-1 rounded-b-medium flex inset-x-0 justify-end p-1 w-full">
            <li className="relative w-fit">
              <Button
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
                    <input
                      className="opacity-0 z-[10] absolute inset-0"
                      type="file"
                      id="file_input"
                      onChange={(e) => {
                        onChange(Array.from(e?.target?.files ?? []));
                      }}
                      accept="image/png,image/jpg,image/jpeg"
                      multiple={true}
                    />
                  )}
                />
              </Button>
            </li>
          </ul>
        </div>

        {(images ?? []).length > 0 && (
          <div className="w-full flex flex-col gap-2 ">
            <TypographyMuted>
              {images?.length} Image{(images ?? []).length > 1 && "s"} choosen
            </TypographyMuted>
            <CreatePostImageChip images={images} onCloseClick={setValue} />
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
          {(watch("title") ||
            (images?.length ?? 0) > 0 ||
            watch("content")) && (
            <Button type="button" color="default" onClick={() => reset()}>
              Cancel
            </Button>
          )}
          <Button type="submit" color="primary">
            Create Post
          </Button>
        </div>

        {!isNotPostPage && (
          <Button
            type="submit"
            color="primary"
            className="fixed top-[12px] right-4 z-[41]"
          >
            Create Post
          </Button>
        )}
      </form>

      {withPreview && (
        <div className="w-full flex flex-col gap-2 pb-16">
          <TypographyH4 className="px-4">Preview</TypographyH4>
          <PostCard
            shadow="none"
            radius="none"
            isPreview
            className={`rounded-none w-full`}
            post={post as PostExtended}
          />
        </div>
      )}
    </>
  );
}

// onChange={(e) => {
//   const formData = new FormData();
//   formData.append("title", "Yahahaa");
//   formData.append("content", "Yahahaaysyuusyuusyu");
//   Array.from(e.target.files ?? []).forEach((file) =>
//     formData.append("images", file)
//   );
//   // formData.append(
//   //   "images",
//   //   JSON.stringify([...Array.from(e.target.files ?? [])])
//   // );
//   fetch("http://localhost:5000/api/posts", {
//     method: "POST",
//     headers: {
//       // "Content-type": "application/json",
//       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJoYWZmYWUxMjRAZ21haWwuY29tIiwidXNlcm5hbWUiOiJiZWR1bCIsImlhdCI6MTY5NTU0NTExOCwiZXhwIjoxNjk1NTQ4NzE4fQ.57QXnV4lOKGmd56WP62bgGswC8lPwm5XwaylESpxgyk`,
//     },
//     body: formData,
//   })
//     .then((res) => res.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.error("error ", err));
// }}
