"use client";

import { PostIdContext, SetSelectedPostId } from "@/context/edit-post-context";
import { DisclosureContext } from "@/context/edit-post-context";
import { useCallback, useContext } from "react";

export const useShowEditPost = () => {
  const onOpen = useContext(DisclosureContext).onOpen;
  const setSelectedPostId = useContext(SetSelectedPostId);
  const handleOpen = useCallback((postId: number) => {
    setSelectedPostId((c) => postId);
    onOpen();
  }, []);

  return handleOpen;
};

export const useGetSelectedPostId = () => useContext(PostIdContext);

export const useShowEditPostDisclosure = () => {
  const { onClose: close, ...rest } = useContext(DisclosureContext);
  const setSelectedId = useContext(SetSelectedPostId);

  const onClose = useCallback(() => {
    close();
    setSelectedId((c) => -1);
  }, []);

  return { onClose, ...rest };
};
