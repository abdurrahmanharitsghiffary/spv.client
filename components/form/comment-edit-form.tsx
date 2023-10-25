"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input, Textarea } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

const commentEditSchema = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .nonempty({ message: "Comment must not be empty" }),
});

type CommentEditSchema = z.infer<typeof commentEditSchema>;

export default function CommentEditForm({ className }: { className?: string }) {
  const isOpen = useCommentEditStore((state) => state.isOpen);
  const handleClose = useHideCommentEditForm();
  const { updateCommentAsync } = useUpdateComment();
  const selectedComment = useGetSelectedEditComment();
  const isSSR = useIsSSR();
  const {
    setValue,
    handleSubmit,
    register,
    watch,
    reset,
    formState: {
      errors: { comment: commentErrors },
      isSubmitSuccessful,
    },
  } = useForm<CommentEditSchema>({
    resolver: zodResolver(commentEditSchema),
    values: { comment: selectedComment?.comment ?? "" },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
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

  if (!isOpen) return null;

  return (
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
          <div className="w-full relative">
            {isSSR ? (
              <Input type="text" placeholder="Write your comment..." />
            ) : (
              <div className="w-full relative flex items-center justify-start">
                <Textarea
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
                  placeholder="Write your comment..."
                  {...register("comment")}
                />
                {currentComment ? (
                  <Button
                    type="submit"
                    isIconOnly
                    radius="full"
                    color="primary"
                    variant="light"
                    className="absolute top-[6px] right-0"
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
            className="text-[18px]"
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
  );
}
