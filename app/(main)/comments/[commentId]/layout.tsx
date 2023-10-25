import CommentBackLink from "@/components/button/comment-back-link";
import CommentForm from "@/components/form/comment-form";
import Giphy from "@/components/giphy";
import ModalGif from "@/components/modal/modal-gif";
import CommentPageProvider from "@/components/providers/comment-provider";
import GifMenuProvider from "@/context/gif-menu-context";
import ModalGifProvider from "@/context/modal-gif-context";
import ReplyProvider from "@/context/reply-context";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";

export default function CommentIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommentPageProvider>
      <Card className="w-full shadow-none mx-0 max-w-lg absolute top-0 rounded-none min-h-[100dvh]">
        <CardBody className="p-0 m-0 relative w-full">
          <CommentBackLink />
          {children}
        </CardBody>
        <Giphy />
        <ModalGif />
        <CommentForm />
      </Card>
    </CommentPageProvider>
  );
}
