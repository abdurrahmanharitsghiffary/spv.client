"use client";
import { createContext, useState } from "react";

export interface ReplyObject {
  id: null | number;
  username: string;
}

export const ReplyContext = createContext<ReplyObject>({
  id: null,
  username: "",
});
export const ReplyContextSetter = createContext<
  React.Dispatch<React.SetStateAction<ReplyObject>>
>(() => {});

export default function ReplyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [replyId, setReplyId] = useState<ReplyObject>({
    id: null,
    username: "",
  });

  return (
    <ReplyContext.Provider value={replyId}>
      <ReplyContextSetter.Provider value={setReplyId}>
        {children}
      </ReplyContextSetter.Provider>
    </ReplyContext.Provider>
  );
}
