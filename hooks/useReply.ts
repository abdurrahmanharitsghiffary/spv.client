"use client";
import {
  ReplyContext,
  ReplyContextSetter,
  ReplyObject,
} from "@/context/reply-context";
import { useCallback, useContext } from "react";

export const useGetReplyId = () => {
  const replyId = useContext(ReplyContext);

  return replyId;
};

export const useSetReplyId = () => {
  const setReplyId = useContext(ReplyContextSetter);

  const handleReply = useCallback(
    (replyId: ReplyObject) => {
      setReplyId((c) => ({ ...c, ...replyId }));
    },
    [setReplyId]
  );

  return handleReply;
};
