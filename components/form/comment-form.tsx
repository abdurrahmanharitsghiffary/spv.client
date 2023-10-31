"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiSend } from "react-icons/bi";
import { z } from "zod";
import CommentFormImage from "./comment-form-image";
import { useGetReplyId, useSetReplyId } from "@/hooks/use-reply";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { useIsSSR } from "@react-aria/ssr";
import { MAX_FILE_SIZE } from "@/lib/createPostSchema";
import { formatBytes } from "@/lib/formatBytes";
import Recorder from "../recorder";
import CommentFormPopover from "./comment-form-popover";
import { useGifMenuIsOpen, useGifMenuShow } from "@/hooks/use-gif-menu";
import {
  useCreateComment,
  useCreateReplyComment,
} from "@/lib/api/comments/mutation";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const allowedFormat = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const commentValidation = z
  .object({
    comment: z.string(),
    image: z
      .any()
      .refine(
        (file) => file === null || file === undefined || file instanceof File,
        "Image must be a file"
      )
      .refine(
        (file: File) =>
          file === null ||
          file === undefined ||
          allowedFormat.includes(file?.type),
        "Invalid image format, allowed format is .jpg, .jpeg, .png, .webp"
      )
      .refine(
        (file: File) =>
          file === null ||
          file === undefined ||
          (file?.size ?? 0) < MAX_FILE_SIZE,
        "Max file size is " + formatBytes(MAX_FILE_SIZE, "mb") + "Mb"
      )
      .optional(),
  })
  .refine(
    (arg) => {
      if (arg.image) return true;
      if ((arg.comment ?? "").length === 0) return false;
      return true;
    },
    { message: "Comment must not be empty", path: ["comment"] }
  );

type CommentValidation = z.infer<typeof commentValidation>;

export default function CommentForm({
  hideSpacer,
  spacerClassName,
  className,
}: {
  className?: string;
  hideSpacer?: boolean;
  spacerClassName?: string;
}) {
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
  } = useForm<CommentValidation>({
    resolver: zodResolver(commentValidation),
    defaultValues: { image: null },
  });
  const isSSR = useIsSSR();

  // const stringFile = JSON.stringify(watch("image") ?? "");
  const file: File | null = watch("image");

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setReplyId({ id: null, username: "" });
    }
  }, [isSubmitSuccessful, reset]);

  const handleImageReset = useCallback(() => {
    setValue("image", null);
  }, []);

  const showGifMenu = useGifMenuShow();
  const gifMenuIsOpen = useGifMenuIsOpen();
  const replyId = useGetReplyId();
  const setReplyId = useSetReplyId();
  const currentComment = watch("comment");
  const [formHeight, setFormHeight] = useState(0);
  const formContainerRef = useCallback(
    (node: HTMLDivElement) => {
      setFormHeight(node?.offsetHeight < 67 ? 67 : node?.offsetHeight ?? 67);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentComment, replyId.id, file, gifMenuIsOpen, errors.image]
  );

  const fieldIsError = errors.comment?.message ? true : false;

  const handleGifMenu = () => {
    showGifMenu();
  };

  const onSubmit: SubmitHandler<CommentValidation> = (data) => {
    // toast.promise(
    replyId.id || commentId
      ? createReplyCommentAsync({
          comment: data.comment,
          image: data?.image,
          commentId: replyId.id ?? Number(commentId),
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
      {(replyId?.id || file || fieldIsError || formHeight) && !hideSpacer ? (
        <div
          className={`w-full dark:bg-content1 ${spacerClassName ?? ""}`}
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
          {replyId.id && replyId.username ? (
            <Chip
              className="m-2 mb-0"
              onClose={() => setReplyId({ id: null, username: "" })}
            >
              Replying to <Link>@{replyId.username}</Link>
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
                    isDisabled={gifMenuIsOpen}
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
                      className="absolute top-[6px] right-0"
                      isDisabled={gifMenuIsOpen}
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
            <CommentFormPopover
              control={control}
              isGifMenuOpen={gifMenuIsOpen}
              onGifMenuOpen={handleGifMenu}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
