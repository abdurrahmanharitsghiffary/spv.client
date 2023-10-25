import CommentEditForm from "@/components/form/comment-edit-form";
import CommentForm from "@/components/form/comment-form";
import Giphy from "@/components/giphy";
import ModalGif from "@/components/modal/modal-gif";
import GifMenuProvider from "@/context/gif-menu-context";
import ModalGifProvider from "@/context/modal-gif-context";
import ReplyProvider from "@/context/reply-context";
import React from "react";

export default function PostParamsLayout({
  params,
  children,
}: //   modal,
{
  params: { postId: string };
  //   modal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ReplyProvider>
      <GifMenuProvider>
        <ModalGifProvider>
          {children}
          <Giphy />
          <CommentForm />
          <CommentEditForm />
          <ModalGif />
        </ModalGifProvider>
      </GifMenuProvider>
    </ReplyProvider>
  );
}
