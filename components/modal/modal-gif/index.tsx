"use client";
import React from "react";
import ModalLayout from "../layout";
import { useGetGif, useGifModalControls } from "@/hooks/useModalGif";
import { Gif } from "@giphy/react-components";
import { Button } from "@nextui-org/button";
import { useGifMenuClose } from "@/hooks/useGifMenu";
import { useGetReplyId, useSetReplyId } from "@/hooks/useReply";
import {
  useCreateComment,
  useCreateReplyComment,
} from "@/lib/api/comments/mutation";
import { useParams } from "next/navigation";

export default function ModalGif() {
  const closeGifMenu = useGifMenuClose();
  const gifControls = useGifModalControls();
  const gif = useGetGif();
  const setReplyId = useSetReplyId();
  const replyId = useGetReplyId();
  const { createComment } = useCreateComment();
  const { createReplyComment } = useCreateReplyComment();
  const { postId } = useParams();

  const handleCreateComment = () => {
    if (!postId) return null;
    if (replyId.id)
      return createReplyComment({
        imageSrc: gif?.images?.original?.url,
        comment: "",
        commentId: replyId.id,
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
      onClose={gifControls.onClose}
      isOpen={gifControls.isOpen}
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
            setReplyId({ id: null, username: "" });
            gifControls.onClose();
            closeGifMenu();
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
