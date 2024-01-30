"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "@nextui-org/divider";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CommentFormImage from "../comment-form-image";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import Recorder from "../../recorder";
import CommentFormPopover from "../comment-form-popover";
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
  useGetSelectedCommentReplyUsername,
} from "@/stores/comment-reply-store";
import CommentFormLayout from "./layout";
import CommentFormWrapper from "./wrapper";
import CommentFormBody from "./body";
import Spacer from "./spacer";
import SendTextarea from "@/components/input/send-textarea";
import { toast } from "react-toastify";
import useHistory from "@/hooks/use-history";

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
  console.log(replyId, "Reply id");
  const replyUsername = useGetSelectedCommentReplyUsername() ?? "";
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
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<CreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { image: null, comment: "" },
  });

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

  const onSubmit: SubmitHandler<CreateCommentSchema> = async (data) => {
    if (isSubmitting) return null;
    try {
      await (replyId || commentId
        ? createReplyCommentAsync({
            body: {
              comment: data.comment,
              image: data?.image,
            },
            params: {
              commentId: replyId ?? Number(commentId),
            },
            formData: true,
          })
        : createCommentAsync({
            body: {
              ...data,
              postId: Number(postId),
              parentId: null,
            },
            formData: true,
          }));
    } catch (err: any) {
      if (err?.message) {
        toast.error(err?.message);
      }
    }
  };

  const handleSuccessSpeech = (val: string | undefined | null) => {
    if (val) setValue("comment", val);
  };

  useEffect(() => {
    const main = document.querySelector("main.container");
    if (main) {
      main.classList.remove("pb-14");
    }

    return () => {
      if (main) main.classList.add("pb-14");
    };
  }, []);

  const history = useHistory();
  console.log(history, "History");

  return (
    <>
      <Spacer
        isShow={
          ((replyId || file || fieldIsError || formHeight) &&
            !hideSpacer) as boolean
        }
        className={`w-full ${spacerClassName ?? ""}`}
        style={{
          height: formHeight,
        }}
      />
      <CommentFormLayout className={className} ref={formContainerRef}>
        <CommentFormImage
          errors={errors.image?.message}
          image={file}
          onDataSuccess={handleImageReset}
        />
        <CommentFormWrapper>
          <Divider />
          {replyId && replyUsername ? (
            <Chip className="m-2 mb-0" onClose={resetReply}>
              Replying to <Link>@{replyUsername}</Link>
            </Chip>
          ) : (
            ""
          )}
          <CommentFormBody as="form" onSubmit={handleSubmit(onSubmit)}>
            <SendTextarea
              control={control}
              isShowSendButton={(currentComment || file) as unknown as boolean}
              name="comment"
              shouldShowError={false}
              placeholder="Write your comment..."
              id="cm9ti2pt"
              autoFocus
              className="h-fit"
            />
            <Recorder
              className="text-[1.125rem]"
              onSpeechSuccess={handleSuccessSpeech}
              radius="md"
            />
            <CommentFormPopover control={control} />
          </CommentFormBody>
        </CommentFormWrapper>
      </CommentFormLayout>
    </>
  );
}
