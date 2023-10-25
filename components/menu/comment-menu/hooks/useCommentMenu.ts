import { useCallback, useContext } from "react";
import {
  CommentContext,
  CommentMenuControlsContext,
  CommentSetter,
} from "../context/comment-menu-context";
import { Comment } from "@/types/comment";

export const useSetSelectedComment = () => useContext(CommentSetter);
export const useGetSelectedComment = () => useContext(CommentContext);

export const useShowCommentMenu = () => {
  const { onOpen: open } = useContext(CommentMenuControlsContext);
  const setComment = useSetSelectedComment();

  const onOpen = useCallback((comment: Comment) => {
    setComment((c) => ({ ...c, ...comment }));
    open();
  }, []);
  return onOpen;
};

export const useCommentMenuControls = () => {
  const setComment = useSetSelectedComment();
  const { onClose: close, ...rest } = useContext(CommentMenuControlsContext);
  const onClose = useCallback(() => {
    setComment(null);
    close();
  }, []);
  return { onClose, ...rest };
};
