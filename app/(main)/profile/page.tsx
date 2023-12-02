"use client";
import CoverImage from "@/components/image/cover-image";
import PostsGridLayout from "@/components/layout/posts-grid-layout";
import PostCard from "@/components/post/post-card";
import ProfileImage from "@/components/image/profile-image";
import {
  TypographyH3,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import { Divider } from "@nextui-org/divider";
import React from "react";
import ProfileInfo from "@/components/profile/profile-info";
import { useGetMyAccountInfo, useGetMyPosts } from "@/lib/api/account/query";
import ProfileActionButton from "@/components/profile/profile-action-button";
import CreatePostForm from "@/components/form/create-post-form";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import PostCardSkeleton from "@/components/post/skeleton";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/spinner";

export default function ProfilePage() {
  const { myAccountInfo, isLoading, isSuccess } = useGetMyAccountInfo();
  const {
    myPosts,
    data,
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyPosts();
  const isDisabled =
    !isSuccess || (data?.pageParams ?? []).some((params) => params === null);
  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isDisabled,
    isFetching,
  });

  const userPosts = myPosts?.data ?? [];
  const followers = myAccountInfo?.data?.followedBy?.total ?? 0;
  const following = myAccountInfo?.data?.following?.total ?? 0;
  const totalPost = myAccountInfo?.data?.posts?.total ?? 0;

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        isSuccess && (
          <div className="w-full pt-2 flex flex-col items-center justify-start gap-2 relative">
            <CoverImage
              src={myAccountInfo?.data?.profile?.coverImage?.src ?? ""}
              className="mb-20 pt-2"
            />
            <ProfileImage
              src={myAccountInfo?.data?.profile?.avatarImage?.src ?? ""}
            />
            <div className="flex flex-col justify-start items-center w-full px-4">
              <TypographyH3 className="text-center">
                {myAccountInfo?.data?.fullName}
              </TypographyH3>
              <TypographyMuted className="text-center">
                {myAccountInfo?.data?.username}
              </TypographyMuted>
              <TypographyP>
                {myAccountInfo?.data?.profile?.description}
              </TypographyP>

              <ProfileInfo
                userId={myAccountInfo?.data?.id ?? -1}
                followedCount={following}
                followersCount={followers}
                postCount={totalPost}
              />
            </div>
            <ProfileActionButton />
          </div>
        )
      )}
      <Divider className="mt-7" />
      <CreatePostForm isNotPostPage withPreview={false} autoFocus={false} />
      <PostsGridLayout>
        {isPostLoading
          ? [1, 2, 3, 4, 5].map((item) => <PostCardSkeleton key={item} />)
          : isPostSuccess &&
            userPosts?.map((post) => <PostCard key={post?.id} post={post} />)}
        {isFetchingNextPage && <Spinner className="mt-4" />}
        <div className="w-full" ref={ref}></div>
      </PostsGridLayout>
    </>
  );
}
