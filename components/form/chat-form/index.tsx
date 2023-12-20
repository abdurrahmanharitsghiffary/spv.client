"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommentFormImage from "../comment-form-image";
import Recorder from "../../recorder";
import { CreateChatSchema, createChatSchema } from "@/lib/zod-schema/chat";
import FileButton from "../../input/file-btn";
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
import ImageChip from "../image-chip";

export default function ChatForm() {
  const socket = useSocket();
  const { createMessageAsync } = useCreateMessage();
  const timeRef = useRef<NodeJS.Timeout | undefined>();
  const { chatId } = useParams();
  const session = useSession();
  const {
    formState: { errors, isSubmitSuccessful },
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<CreateChatSchema>({
    resolver: zodResolver(createChatSchema),
    defaultValues: { images: [], chat: "" },
  });
  const text = watch("chat");
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

  // The problem is when user is typing and the other user is also typing.
  // Example: User A is typing, and so is User B.
  // User A starts typing and stops; the timeout is set to 4000ms.
  // Then, 1s later, User B starts typing. However, User A's timeout will be executed after 3s.
  // User B is still typing, but after 3s, User A's timeout is executed.
  // Consequently, the typing animation on User A for User B will be stopped before User B's timeout is executed.
  // However, it will be shown again because User B is still typing.

  const onUserTyping = (data: any) => {
    // Fixing problem by clearing other user timeout, i am genius 😎😎😎
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
    if (text) {
      // handleTypingEnd();
      handleTypingStart();
      console.time("startTyping");
      timeRef.current = setTimeout(() => {
        console.timeEnd("startTyping");
        handleTypingEnd();
      }, 4000);
    }

    return () => {
      console.log("TimeOut cleared!");
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
    try {
      await createMessageAsync({
        data: {
          chatRoomId: Number(chatId),
          message: data.chat ?? "",
          images: data.images ?? [],
        },
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
  const images = watch("images") ?? [];
  // const handleImageReset = useCallback(() => {
  //   setValue("images", []);
  // }, []);

  const handleResultChange = (result: string | null | undefined) => {
    if (!result) return null;
    setValue("chat", result);
  };

  const handleClose = (file: File, image: File) => {
    if (!file) return null;
    const files = Array.from(images).filter(
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
        <div className="p-2 border-t-1 border-divider">
          <Slider>
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
              <FileButton
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
