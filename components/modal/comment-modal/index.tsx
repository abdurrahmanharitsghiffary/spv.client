"use client";
import React from "react";
import ModalLayoutV2 from "../layoutV2";
import { useRouter } from "next/navigation";
import CommentEditForm from "@/components/form/comment-form/edit-form";
import CommentForm from "@/components/form/comment-form";

export default function CommentModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <ModalLayoutV2
      classNames={{ body: "px-0", footer: "p-0" }}
      wrapperClassNames={{ wrapper: "z-[199]" }}
      isOpen
      onClose={() => router.back()}
      footer={
        <div className="w-full">
          <CommentEditForm />
          <CommentForm />
        </div>
      }
    >
      {children}
    </ModalLayoutV2>
  );
}
