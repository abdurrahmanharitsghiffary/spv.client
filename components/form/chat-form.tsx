"use client";
import React, { useCallback, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";
import { Button } from "@nextui-org/react";
import { BiSend } from "react-icons/bi";
import CommentFormImage from "./comment-form-image";
import clsx from "clsx";
import Recorder from "../recorder";
import { CreateChatSchema, createChatSchema } from "@/lib/zod-schema/chat";
import FileButton from "../input/file-btn";
import { useCreateMessage } from "@/lib/api/chats/mutation";
import { useParams } from "next/navigation";

export default function ChatForm() {
  const { createMessage, createMessageAsync } = useCreateMessage();
  const { chatId } = useParams();
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
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const isSSR = useIsSSR();
  const onSubmit: SubmitHandler<CreateChatSchema> = async (data) => {
    await createMessageAsync({
      formData: true,
      body: {
        chatRoomId: Number(chatId),
        message: data.chat ?? "",
        image: data.image,
      },
    });
  };
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
                  className="absolute top-[6px] right-0 z-[102]"
                  color="primary"
                >
                  <BiSend size={18} />
                </Button>
              )}
            </div>
          )}
          <Recorder
            radius="md"
            className="text-[1.125rem]"
            onSpeechSuccess={handleResultChange}
          />
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange } }) => (
              <FileButton
                onChange={(e) => {
                  onChange(e.target?.files?.[0] ?? null);
                }}
              />
            )}
          />
        </form>
      </div>
    </div>
  );
}
