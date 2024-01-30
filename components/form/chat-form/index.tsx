"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Recorder from "../../recorder";
import { CreateChatSchema, createChatSchema } from "@/lib/zod-schema/chat";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateMessage } from "@/lib/api/messages/mutation";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";
import ChatFormLayout from "./layout";
import ChatFormBody from "./body";
import SendTextarea from "../../input/send-textarea";
import Slider from "@/components/slider";
import ImageChip from "../../image/image-chip";
import { TypographyMuted } from "@/components/ui/typography";
import { Checkbox } from "@nextui-org/react";
import clsx from "clsx";
import ImageFileButton from "@/components/input/image-file-button";

export default function ChatForm() {
  const { chatId } = useParams();
  const [isChipTruncated, setIsChipTruncated] = useState(true);
  const socket = useSocket();
  const { createMessageAsync } = useCreateMessage();
  const timeRef = useRef<NodeJS.Timeout | undefined>();
  const session = useSession();
  const {
    formState: { errors, isSubmitSuccessful, isSubmitting },
    control,
    reset,
    handleSubmit,
    setValue,
  } = useForm<CreateChatSchema>({
    resolver: zodResolver(createChatSchema),
    defaultValues: { images: [], chat: "" },
  });
  const text = useWatch({ control, name: "chat" });
  useEffect(() => {
    if (text) {
      document.body.scrollIntoView(false);
    }
  }, [text]);

  const handleTypingEnd = useCallback(() => {
    if (!socket || !session || !chatId) return null;
    socket.emit(Socket_Event.TYPING_END, {
      chatId: Number(chatId),
      userId: session?.id,
      fullName: session?.fullName,
      username: session?.username,
    });
  }, [session, socket, chatId]);

  const handleTypingStart = useCallback(() => {
    if (!socket || !session || !chatId) return null;
    socket.emit(Socket_Event.TYPING_MESSAGE, {
      chatId: Number(chatId),
      userId: session?.id,
      fullName: session?.fullName,
      username: session?.username,
    });
  }, [session, socket, chatId]);

  const onUserTyping = (data: any) => {
    if (data.userId !== session?.id) {
      clearTimeout(timeRef.current);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(Socket_Event.USER_TYPING, onUserTyping);
    return () => {
      socket.off(Socket_Event.USER_TYPING, onUserTyping);
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      handleTypingEnd();
    };
  }, [handleTypingEnd]);

  useEffect(() => {
    if (text) {
      // handleTypingEnd();
      handleTypingStart();
      timeRef.current = setTimeout(() => {
        handleTypingEnd();
      }, 4000);
    }

    return () => {
      clearTimeout(timeRef.current);
    };
  }, [handleTypingEnd, handleTypingStart, text]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      handleTypingEnd();
    }
  }, [isSubmitSuccessful, handleTypingEnd]);

  const onSubmit: SubmitHandler<CreateChatSchema> = async (data) => {
    if (isSubmitting) return null;
    try {
      await createMessageAsync({
        body: {
          chatRoomId: Number(chatId),
          message: data.chat ?? "",
          images: data.images,
        },
        formData: true,
      });
    } catch (err: any) {
      let message = err?.message;
      if (message.includes("Access Denied")) {
        message =
          "Cannot send message, because you are not participated in the group";
      }
      toast.error(message ?? "Something went wrong!");
    }
  };
  const images: File[] = useWatch({ control, name: "images" });

  const handleResultChange = (result: string | null | undefined) => {
    if (!result) return null;
    setValue("chat", result);
  };

  const handleClose = (file: File, image: File) => {
    if (!file) return null;
    const files = images.filter(
      (img) =>
        !`${img.name}${img.size}${image.type}`.includes(
          `${image.name}${image.size}${image.type}`
        )
    );

    setValue("images", [...files]);
  };

  return (
    <ChatFormLayout>
      {images.length > 0 && (
        <div className="p-2 border-t-1 flex flex-col gap-2 border-divider">
          <TypographyMuted>
            {images?.length} Image{(images ?? []).length > 1 && "s"} choosen
          </TypographyMuted>
          <Checkbox
            size="sm"
            isSelected={isChipTruncated}
            onValueChange={setIsChipTruncated}
          >
            Truncate
          </Checkbox>
          <Slider
            classNames={{
              body: clsx(isChipTruncated ? "flex-nowrap" : "flex-wrap"),
              wrapper: clsx(
                !isChipTruncated && "!overflow-y-auto max-h-[250px]"
              ),
            }}
          >
            {images.map((image: File) => (
              <ImageChip
                image={image}
                key={image.name + image.size}
                onClose={(f) => handleClose(f, image)}
              />
            ))}
          </Slider>
        </div>
      )}

      <ChatFormBody>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex gap-2 items-center"
        >
          <SendTextarea
            isShowSendButton={text as unknown as boolean}
            control={control}
            name="chat"
          />
          <Recorder
            isEnded={isSubmitSuccessful}
            radius="md"
            className="text-[1.125rem]"
            onSpeechSuccess={handleResultChange}
          />
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange } }) => (
              <ImageFileButton
                multiple
                onChange={(e) => {
                  onChange(Array.from(e.target?.files ?? []));
                  e.target.value = "";
                }}
              />
            )}
          />
        </form>
      </ChatFormBody>
    </ChatFormLayout>
  );
}

// acceptedFiles={[
//   ...(ACCEPTED_IMAGE_TYPES as any),
//   // "application/pdf",
//   // "application/vnd.ms-excel",
//   // "application/vnd.rar",
//   // "application/zip",
//   // "image/jpg",
//   // "image/png",
//   // "image/jpeg",
//   // "image/webp",
//   // "application/msword",
//   // "text/plain",
//   // "video/3gpp",
//   // "video/ogg",
// ]}
