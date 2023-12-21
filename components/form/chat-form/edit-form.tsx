"use client";

import React, { useEffect } from "react";
import ChatFormLayout from "./layout";
import ChatFormBody from "./body";
import SendTextarea from "@/components/input/send-textarea";
import Recorder from "@/components/recorder";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zChatMessage } from "@/lib/zod-schema/chat";
import { useEditMessage } from "@/lib/api/messages/mutation";
import { toast } from "react-toastify";
import {
  useMessageMenuActions,
  useMessageMenuId,
} from "@/stores/message-menu-store";
import { Button } from "@nextui-org/button";
import { useMessageEditDisclosure } from "@/context/message-edit-form-context";
import { useBodyOverflowHidden } from "@/hooks/use-body-overflow-hidden";
import { useGetMessage } from "@/lib/api/messages/query";

const messageEditSchema = z.object({
  message: zChatMessage,
});

type MessageEditSchema = z.infer<typeof messageEditSchema>;

export default function ChatEditForm() {
  const messageId = useMessageMenuId();
  const { message } = useGetMessage(messageId);
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isSubmitSuccessful },
    reset,
  } = useForm<MessageEditSchema>({
    resolver: zodResolver(messageEditSchema),
    values: {
      message: message?.data?.message ?? "",
    },
  });
  const { reset: resetMessage } = useMessageMenuActions();
  const { isOpen, onClose } = useMessageEditDisclosure();

  const text = watch("message");
  const { editMessageAsync } = useEditMessage();

  useEffect(() => {
    if (isSubmitSuccessful) {
      handleClose();
    }
  }, [isSubmitSuccessful]);

  const handleClose = () => {
    onClose();
    reset();
    resetMessage();
  };

  const onSubmit: SubmitHandler<MessageEditSchema> = async (data) => {
    await toast.promise(
      editMessageAsync({ body: data, params: { messageId } })
        .then((res) => res)
        .catch((err) => Promise.reject(err)),
      {
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
        pending: "Updating message...",
      }
    );
  };

  const handleResultChange = (result: string | null | undefined) => {
    if (!result) return null;
    setValue("message", result);
  };

  useBodyOverflowHidden(isOpen);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="inset-0 fixed bg-overlay/50 z-20"
        onClick={handleClose}
      ></div>
      <ChatFormLayout>
        <ChatFormBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex gap-2 items-center"
          >
            <SendTextarea
              placeholder="Write a new message..."
              isShowSendButton={text as unknown as boolean}
              control={control}
              autoFocus
              name="message"
            />
            <Recorder
              isEnded={isSubmitSuccessful}
              radius="md"
              className="text-[1.125rem]"
              onSpeechSuccess={handleResultChange}
            />
            <Button onClick={handleClose}>Cancel</Button>
          </form>
        </ChatFormBody>
      </ChatFormLayout>
    </>
  );
}
