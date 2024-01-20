"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Recorder from "../../recorder";
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
import CommentFormLayout from "./layout";
import CommentFormWrapper from "./wrapper";
import CommentFormBody from "./body";
import SendTextarea from "@/components/input/send-textarea";

export default function CommentEditForm({ className }: { className?: string }) {
  const isOpen = useCommentEditStore((state) => state.isOpen);
  const onClose = useHideCommentEditForm();
  const { updateCommentAsync } = useUpdateComment();
  const selectedComment = useGetSelectedEditComment();
  const { comment } = useGetComment(selectedComment?.id ?? -1);
  const {
    setValue,
    handleSubmit,
    watch,
    control,
    reset,
    formState: {
      errors: { comment: commentErrors },
      isSubmitSuccessful,
    },
  } = useForm<CommentEditSchema>({
    resolver: zodResolver(commentEditSchema),
    defaultValues: { comment: "" },
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
      params: {
        commentId: selectedComment?.id,
      },
      body: {
        comment: data?.comment,
      },
    });
  };
  const currentComment = watch("comment");
  const handleSuccessSpeech = (val: string | undefined | null) => {
    if (val) setValue("comment", val);
  };

  useBodyOverflowHidden(isOpen);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[101] bg-overlay/50"
        onClick={handleClose}
      ></div>
      <CommentFormLayout className={clsx("z-[102]", className)}>
        <CommentFormWrapper>
          <Divider />
          <CommentFormBody as="form" onSubmit={handleSubmit(onSubmit)}>
            <SendTextarea
              placeholder="Write new comment..."
              control={control}
              name="comment"
              isShowSendButton={currentComment as unknown as boolean}
            />
            <Recorder
              className="text-[1.125rem]"
              onSpeechSuccess={handleSuccessSpeech}
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
          </CommentFormBody>
        </CommentFormWrapper>
      </CommentFormLayout>
    </>
  );
}
{
  /* <div className="w-full relative">
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
            </div> */
}
