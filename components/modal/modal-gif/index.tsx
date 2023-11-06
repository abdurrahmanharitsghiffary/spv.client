"use client";
import React from "react";
import ModalLayout from "../layout";
import { Gif } from "@giphy/react-components";
import { Button } from "@nextui-org/button";
import {
  useCreateComment,
  useCreateReplyComment,
} from "@/lib/api/comments/mutation";
import { useParams } from "next/navigation";
import {
  useGetSelectedCommentReplyId,
  useResetReplyValue,
} from "@/stores/comment-reply-store";
import {
  useGetGif,
  useHideModalGif,
  useModalGifIsOpen,
} from "@/stores/modal-gif-store";
import { useHideGiphyGrid } from "@/stores/giphy-grid-store";

function ModalGif() {
  const hideGiphyGrid = useHideGiphyGrid();
  const isOpen = useModalGifIsOpen();
  const onClose = useHideModalGif();
  const gif = useGetGif();
  const resetReply = useResetReplyValue();
  const replyId = useGetSelectedCommentReplyId();
  const { createComment } = useCreateComment();
  const { createReplyComment } = useCreateReplyComment();
  const { postId } = useParams();

  const handleCreateComment = () => {
    if (!postId) return null;
    if (replyId)
      return createReplyComment({
        imageSrc: gif?.images?.original?.url,
        comment: "",
        commentId: replyId,
      });
    return createComment({
      data: {
        comment: "",
        postId: Number(postId),
        imageSrc: gif?.images?.original?.url,
      },
    });
  };

  return (
    <ModalLayout
      backdrop="blur"
      onClose={onClose}
      isOpen={isOpen}
      classNames={{
        body: "p-0 m-0 shadow-medium",
        wrapper:
          "z-[102] w-fit h-fit m-0 p-0 bg-opacity-0 rounded-none shadow-none",
        header: "p-0 w-0 h-0",
      }}
      placement="center"
      size="sm"
      footer={
        <Button
          type="button"
          autoFocus
          className="w-full"
          variant="shadow"
          size="lg"
          color="primary"
          onClick={() => {
            handleCreateComment();
            resetReply();
            onClose();
            hideGiphyGrid();
          }}
        >
          Post
        </Button>
      }
      hideCloseButton
    >
      {gif ? <Gif gif={gif} width={250} /> : ""}
    </ModalLayout>
  );
}

export default ModalGif;
