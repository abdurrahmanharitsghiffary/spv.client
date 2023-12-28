"use client";

import { useGetComment, useGetCommentLikes } from "@/lib/api/comments/query";
import React from "react";
import ModalLayoutV2 from "../layoutV2";
import { TypographyH3 } from "@/components/ui/typography";
import UserListboxLoading from "@/components/loading/user-listbox-loading";
import ListboxUsers from "@/components/user/listbox-users";
import Empty from "@/components/empty";
import { Spinner } from "@nextui-org/spinner";
import {
  useCommentLikeModalActions,
  useCommentLikeModalIsOpen,
  useGetSelectedCommentLikeId,
} from "@/stores/comment-likes-modal-store";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import Author from "@/components/author";
import History from "@/components/history";
import { Divider } from "@nextui-org/react";

export default function CommentLikesModal() {
  const commentId = useGetSelectedCommentLikeId();
  const { onClose } = useCommentLikeModalActions();
  const isOpen = useCommentLikeModalIsOpen();
  const { comment } = useGetComment(Number(commentId));
  const {
    isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    resp,
    isSuccess,
    isLoading,
  } = useGetCommentLikes(commentId);

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
  });

  const totalLikes = resp?.pagination?.total_records ?? 0;
  const users = resp?.data ?? [];

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      classNames={{ body: "px-0" }}
    >
      <div className="flex flex-col gap-4 px-4">
        <Author author={comment?.data?.user} />
        <History
          createdAt={comment?.data?.createdAt}
          updatedAt={comment?.data?.updatedAt}
          className="pt-2"
        />
      </div>
      <Divider />
      {totalLikes > 0 && (
        <TypographyH3 className="!text-base px-4">
          Total like{totalLikes > 1 && "s"} ({totalLikes})
        </TypographyH3>
      )}
      {isLoading ? (
        <UserListboxLoading />
      ) : (
        isSuccess && (
          <ListboxUsers
            users={users}
            emptyContent={<Empty>No user liked this comment.</Empty>}
          />
        )
      )}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Spinner className="my-4 mx-auto" color="primary" />
      )}
    </ModalLayoutV2>
  );
}
