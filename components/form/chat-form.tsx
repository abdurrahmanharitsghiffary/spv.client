"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MAX_FILE_SIZE } from "@/lib/createPostSchema";
import { formatBytes } from "@/lib/formatBytes";
import { Input, Textarea } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";
import { BsCardImage } from "react-icons/bs";
import { Button } from "@nextui-org/react";
import { BiSend } from "react-icons/bi";
import { TypographyMuted } from "../ui/typography";
import CommentFormImage from "./comment-form-image";
import clsx from "clsx";
import Recorder from "../recorder";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const createChatSchema = z
  .object({
    chat: z.string().nonempty({ message: "Chat must not be empty" }),
    image: z
      .any()
      .refine(
        (file: File) =>
          file instanceof File || file === null || file === undefined,
        "Image must be a file"
      )
      .refine(
        (file: File) =>
          file?.size < MAX_FILE_SIZE || file === null || file === undefined,
        `Max image size is ${formatBytes(MAX_FILE_SIZE, "kb")}`
      )
      .refine(
        (file: File) =>
          ACCEPTED_TYPES.includes(file?.type) ||
          file === null ||
          file === undefined,
        "Accepted .jpg, .jpeg, .png, .webp"
      )
      .optional(),
  })
  .refine((arg) => {
    if (!arg.image) return true;
    if (!arg.chat) return false;
    return true;
  });

type CreateChatSchema = z.infer<typeof createChatSchema>;

export default function ChatForm() {
  const {
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<CreateChatSchema>({
    resolver: zodResolver(createChatSchema),
    defaultValues: { image: null },
  });

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  const isSSR = useIsSSR();
  const onSubmit: SubmitHandler<CreateChatSchema> = (data) => console.log(data);
  const image = watch("image");
  console.log(watch("image"));
  const handleImageReset = useCallback(() => {
    setValue("image", null);
  }, []);
  const text = watch("chat");

  const handleResultChange = (result: string | null | undefined) => {
    if (!result) return null;
    setValue("chat", result);
  };

  console.log(image);
  return (
    <div
      className="fixed bottom-0 inset-x-0 gap-2 z-[101]"
      style={{
        backgroundColor:
          "hsl(var(--nextui-content1) / var(--nextui-content1-opacity, var(--tw-bg-opacity)))",
      }}
    >
      <CommentFormImage
        image={image}
        onDataSuccess={handleImageReset}
        errors={errors.image?.message}
      />
      <div className="w-full flex justify-center flex-col gap-2 p-2 border-t-1 border-divider">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex gap-2 items-center"
        >
          {isSSR ? (
            <Input placeholder="Message" />
          ) : (
            <div className="w-full relative flex items-center justify-start">
              <Textarea
                isInvalid={errors.chat?.message !== undefined}
                errorMessage={errors.chat?.message}
                placeholder="Message"
                minRows={1}
                maxRows={4}
                classNames={{
                  inputWrapper: clsx(text || image ? "pr-[50px]" : ""),
                }}
                {...register("chat")}
              />
              {(text || image) && (
                <Button
                  type="submit"
                  variant="light"
                  radius="full"
                  isIconOnly
                  className="absolute top-[6px] right-0"
                  color="primary"
                >
                  <BiSend size={18} />
                </Button>
              )}
            </div>
          )}
          <Recorder
            radius="md"
            className="text-[18px]"
            onSpeechSuccess={handleResultChange}
          />
          <Button className="relative" radius="md" isIconOnly>
            <BsCardImage size={18} />
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <input
                  type="file"
                  multiple={false}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="absolute inset-0 opacity-0"
                  onChange={(e) => {
                    onChange(e?.target?.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                />
              )}
            />
          </Button>
        </form>
      </div>
    </div>
  );
}
