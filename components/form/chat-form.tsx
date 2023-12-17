"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";
import { Button } from "@nextui-org/react";
import { BiSend } from "react-icons/bi";
import CommentFormImage from "./comment-form-image";
import clsx from "clsx";
import Recorder from "../recorder";
import { CreateChatSchema, createChatSchema } from "@/lib/zod-schema/chat";
import FileButton from "../input/file-btn";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateMessage } from "@/lib/api/messages/mutation";
import { TextareaWithControl } from "../input/input-with-control";
import { useSocket } from "@/hooks/use-socket";
import { Socket_Event } from "@/lib/socket-event";
import { useSession } from "@/stores/auth-store";

export default function ChatForm() {
  const socket = useSocket();
  const { createMessageAsync } = useCreateMessage();
  const timeRef = useRef<NodeJS.Timeout | undefined>();
  const isSSR = useIsSSR();
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
    defaultValues: { image: null, chat: "" },
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
        formData: true,
        body: {
          chatRoomId: Number(chatId),
          message: data.chat ?? "",
          image: data.image,
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
  const image = watch("image");
  const handleImageReset = useCallback(() => {
    setValue("image", null);
  }, []);

  const handleResultChange = (result: string | null | undefined) => {
    if (!result) return null;
    setValue("chat", result);
  };

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
              <TextareaWithControl
                name="chat"
                control={control}
                placeholder="Message"
                minRows={1}
                maxRows={4}
                classNames={{
                  inputWrapper: clsx(text || image ? "pr-[50px]" : ""),
                }}
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
            isEnded={isSubmitSuccessful}
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
