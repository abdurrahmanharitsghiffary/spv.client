import GifMenuProvider from "@/context/gif-menu-context";
import ModalGifProvider from "@/context/modal-gif-context";
import ReplyProvider from "@/context/reply-context";
import React from "react";

export default function CommentPageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReplyProvider>
      <GifMenuProvider>
        <ModalGifProvider>{children}</ModalGifProvider>
      </GifMenuProvider>
    </ReplyProvider>
  );
}
