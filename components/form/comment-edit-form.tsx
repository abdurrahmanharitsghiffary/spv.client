"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input, Textarea } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BiSend } from "react-icons/bi";
import { z } from "zod";
import Recorder from "../recorder";
import { useUpdateComment } from "@/lib/api/comments/mutation";
import {
  useCommentEditStore,
  useGetSelectedEditComment,
  useHideCommentEditForm,
} from "@/stores/comment-edit-store";
import clsx from "clsx";
import { CommentEditSchema, commentEditSchema } from "@/lib/zod-schema/comment";
import { useBodyOverflowHidden } from "@/hooks/use-body-overflow-hidden";
import { useGetComment } from "@/lib/api/comments/query";
import { TextareaWithControl } from "./input/input-with-control";

export default function CommentEditForm({ className }: { className?: string }) {
  const isOpen = useCommentEditStore((state) => state.isOpen);
  const onClose = useHideCommentEditForm();
  const { updateCommentAsync } = useUpdateComment();
  const selectedComment = useGetSelectedEditComment();
  const { comment } = useGetComment(selectedComment?.id ?? -1);
  console.log(comment?.data.comment, "Comment");
  const isSSR = useIsSSR();
  const {
    setValue,
    handleSubmit,
    register,
    watch,
    control,
    reset,
    formState: {
      errors: { comment: commentErrors },
      isSubmitSuccessful,
    },
  } = useForm<CommentEditSchema>({
    resolver: zodResolver(commentEditSchema),
    values: { comment: comment?.data?.comment ?? "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      handleClose();
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<CommentEditSchema> = async (data) => {
    if (!selectedComment) return null;
    await updateCommentAsync({
      commentId: selectedComment?.id,
      comment: data?.comment,
    });
  };
  const currentComment = watch("comment");
  const fieldIsError = commentErrors?.message ? true : false;
  const handleSuccessSpeech = (val: string | undefined | null) => {
    if (val) setValue("comment", val);
  };

  const cl = clsx("z-[102] fixed bottom-0 left-0 right-0", className);

  useBodyOverflowHidden(isOpen);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[101] backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className={cl}>
        <Card className="shadow-none rounded-none ">
          <Divider />
          {/* {replyId.id && replyId.username ? (
            <Chip
              className="m-2 mb-0"
              onClose={() => setReplyId({ id: null, username: "" })}
            >
              Replying to <Link>@{replyId.username}</Link>
            </Chip>
          ) : (
            ""
          )} */}
          <CardBody
            className="p-2 flex-row flex justify-between items-center gap-2"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* WE CAN DO IT BY USING CONTROLLER */}

            <div className="w-full relative">
              {isSSR ? (
                <Input type="text" placeholder="Write your comment..." />
              ) : (
                <div className="w-full relative flex items-center justify-start">
                  <TextareaWithControl
                    className="h-fit"
                    autoFocus
                    classNames={{
                      inputWrapper: currentComment ? "pr-[50px]" : "",
                    }}
                    minRows={1}
                    maxRows={4}
                    id="ctmdtf0rm"
                    type="text"
                    color={fieldIsError ? "danger" : "default"}
                    isInvalid={fieldIsError}
                    errorMessage={
                      fieldIsError ? commentErrors?.message ?? "" : ""
                    }
                    control={control}
                    name="comment"
                    placeholder="Write your comment..."
                    // {...register("comment")}
                  />
                  {currentComment ? (
                    <Button
                      type="submit"
                      isIconOnly
                      radius="full"
                      color="primary"
                      variant="light"
                      className="absolute top-[6px] right-0 z-[103]"
                    >
                      <BiSend size={18} />
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
            <Recorder
              className="text-[1.125rem]"
              onSpeechSuccess={handleSuccessSpeech}
              // color="primary"
              radius="md"
            />
            <Button
              onClick={() => {
                reset();
                handleClose();
              }}
            >
              Cancel
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
