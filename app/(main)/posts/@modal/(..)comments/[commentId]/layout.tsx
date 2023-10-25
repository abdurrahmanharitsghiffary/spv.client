import { CommentModalBackLink } from "@/components/button/comment-back-link";
import CommentForm from "@/components/form/comment-form";
import Giphy from "@/components/giphy";
import ModalGif from "@/components/modal/modal-gif";
import CommentPageProvider from "@/components/providers/comment-provider";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";

export default function CommentModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommentPageProvider>
      <div className="fixed inset-0 bg-content1 z-[200] overflow-y-auto hide-scrollbar">
        <CommentModalBackLink />
        <Card className="w-full p-0 m-0 shadow-none mx-auto max-w-lg rounded-none">
          <CardBody className="p-0 m-0 relative hide-scrollbar">
            {children}
          </CardBody>
        </Card>
        <Giphy />
        <CommentForm className="sticky w-full" hideSpacer />
        <ModalGif />
      </div>
    </CommentPageProvider>
  );
}
