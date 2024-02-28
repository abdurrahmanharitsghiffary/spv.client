"use client";

import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useGetPostById, useGetPostLikeByPostId } from "@/lib/api/posts/query";
import React from "react";
import ModalLayoutV2 from "../layoutV2";
import ListboxUsers from "@/components/user/listbox-users";
import { TypographyH3 } from "@/components/ui/typography";
import UserListboxLoading from "@/components/loading/user-listbox-loading";
import { Spinner } from "@nextui-org/spinner";
import {
  useGetSelectedPostLikeId,
  usePostLikeModalActions,
  usePostLikeModalIsOpen,
} from "@/stores/post-likes-modal-store";
import { Divider } from "@nextui-org/divider";
import Author from "@/components/author";
import History from "@/components/history";

export default function PostLikesModal() {
  const postId = useGetSelectedPostLikeId();
  const { onClose } = usePostLikeModalActions();
  const isOpen = usePostLikeModalIsOpen();
  const {
    isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    resp,
    isSuccess,
    isLoading,
  } = useGetPostLikeByPostId(postId);

  const { post } = useGetPostById(postId);

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    fetchNextPage,
    isFetching,
  });

  const totalLikes = resp?.pagination?.totalRecords ?? 0;
  const users = resp?.data ?? [];

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      classNames={{ body: "px-0" }}
    >
      <div className="flex flex-col gap-4 px-4">
        <Author author={post?.data?.author} />
        <History
          createdAt={post?.data?.createdAt}
          updatedAt={post?.data?.updatedAt}
          className="pt-2"
        />
      </div>
      <Divider />
      {totalLikes > 0 && (
        <TypographyH3 className="!text-base px-4">
          Liked by ({totalLikes})
        </TypographyH3>
      )}
      {isLoading ? (
        <UserListboxLoading />
      ) : (
        isSuccess && (
          <ListboxUsers users={users} emptyContent="No user liked this post." />
        )
      )}
      <div ref={ref}></div>
      {isFetchingNextPage && (
        <Spinner className="my-4 mx-auto" color="primary" />
      )}
    </ModalLayoutV2>
  );
}
