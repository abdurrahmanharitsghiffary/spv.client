"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiSend } from "react-icons/bi";
import CommentFormImage from "./comment-form-image";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { useIsSSR } from "@react-aria/ssr";
import Recorder from "../recorder";
import CommentFormPopover from "./comment-form-popover";
import {
  useCreateComment,
  useCreateReplyComment,
} from "@/lib/api/comments/mutation";
import { useParams } from "next/navigation";
import {
  CreateCommentSchema,
  createCommentSchema,
} from "@/lib/zod-schema/comment";
import {
  useGetSelectedCommentReplyId,
  useResetReplyValue,
  useReplyStore,
} from "@/stores/comment-reply-store";
import {
  useGiphyGridIsOpen,
  useShowGiphyGrid,
} from "@/stores/giphy-grid-store";

export default function CommentForm({
  hideSpacer,
  spacerClassName,
  className,
}: {
  className?: string;
  hideSpacer?: boolean;
  spacerClassName?: string;
}) {
  const replyId = useGetSelectedCommentReplyId();
  const replyUsername = useReplyStore((state) => state?.username) ?? "";
  const resetReply = useResetReplyValue();
  const { postId, commentId } = useParams();
  const { createCommentAsync } = useCreateComment();
  const { createReplyCommentAsync } = useCreateReplyComment();
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitSuccessful },
    register,
  } = useForm<CreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { image: null },
  });
  const isSSR = useIsSSR();

  const file: File | null = watch("image");

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      resetReply();
    }
  }, [isSubmitSuccessful]);

  const handleImageReset = useCallback(() => {
    setValue("image", null);
  }, []);

  // const gifMenuIsOpen = useGiphyGridIsOpen();
  const currentComment = watch("comment");
  const [formHeight, setFormHeight] = useState(0);
  const formContainerRef = useCallback(
    (node: HTMLDivElement) => {
      setFormHeight(node?.offsetHeight < 67 ? 67 : node?.offsetHeight ?? 67);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentComment, replyId, file, errors.image]
  );

  const fieldIsError = errors.comment?.message ? true : false;

  console.log(replyId);
  const onSubmit: SubmitHandler<CreateCommentSchema> = (data) => {
    // toast.promise(
    replyId || commentId
      ? createReplyCommentAsync({
          comment: data.comment,
          image: data?.image,
          commentId: replyId ?? Number(commentId),
        })
      : createCommentAsync({
          data: {
            ...data,
            postId: Number(postId),
            parentId: null,
          },
        });
    //   {
    //     error: {
    //       render({ data }) {
    //         return (data as any)?.message ?? "Something went wrong";
    //       },
    //     },
    //     success: "Comment successfully posted",
    //     pending: "Posting comment... please wait",
    //   },
    //   { autoClose: 1100, position: "bottom-right", hideProgressBar: true }
    // );
  };

  const handleSuccessSpeech = (val: string | undefined | null) => {
    if (val) setValue("comment", val);
  };

  const cl = clsx("z-[101] fixed bottom-0 left-0 right-0", className);

  return (
    <>
      {(replyId || file || fieldIsError || formHeight) && !hideSpacer ? (
        <div
          className={`w-full ${spacerClassName ?? ""}`}
          style={{
            height: formHeight,
          }}
        ></div>
      ) : (
        ""
      )}
      <div className={cl} ref={formContainerRef}>
        <CommentFormImage
          errors={errors.image?.message}
          image={file}
          onDataSuccess={handleImageReset}
        />
        <Card className="shadow-none rounded-none ">
          <Divider />
          {replyId && replyUsername ? (
            <Chip className="m-2 mb-0" onClose={resetReply}>
              Replying to <Link>@{replyUsername}</Link>
            </Chip>
          ) : (
            ""
          )}
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
                    classNames={{
                      inputWrapper: currentComment || file ? "pr-[50px]" : "",
                    }}
                    autoFocus
                    minRows={1}
                    maxRows={4}
                    id="cm9ti2pt"
                    type="text"
                    color={fieldIsError ? "danger" : "default"}
                    isInvalid={fieldIsError}
                    errorMessage={
                      fieldIsError ? errors.comment?.message ?? "" : ""
                    }
                    placeholder="Write your comment..."
                    // onBlur={() => clearErrors(["comment"."image"])}
                    {...register("comment")}
                  />
                  {currentComment || file ? (
                    <Button
                      type="submit"
                      isIconOnly
                      radius="full"
                      color="primary"
                      variant="light"
                      className="absolute top-[6px] right-0 z-[102]"
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
            <CommentFormPopover control={control} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
