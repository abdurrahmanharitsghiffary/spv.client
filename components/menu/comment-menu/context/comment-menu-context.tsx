"use client";
import { Disclosure } from "@/types";
import { Comment } from "@/types/comment";
import { useDisclosure } from "@nextui-org/react";
import React, { createContext, useState } from "react";

export const CommentMenuControlsContext = createContext<Disclosure>(
  {} as Disclosure
);

export const CommentContext = createContext<Comment | null>({} as Comment);
export const CommentSetter = createContext<
  React.Dispatch<React.SetStateAction<Comment | null>>
>(() => {});

export default function CommentMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useDisclosure();
  const [comment, setComment] = useState<Comment | null>({} as Comment);

  return (
    <CommentContext.Provider value={comment}>
      <CommentSetter.Provider value={setComment}>
        <CommentMenuControlsContext.Provider value={controls}>
          {children}
        </CommentMenuControlsContext.Provider>
      </CommentSetter.Provider>
    </CommentContext.Provider>
  );
}
