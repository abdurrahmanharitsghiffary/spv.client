"use client";
import CoverImage from "@/components/image/cover-image";
import PostsGridLayout from "@/components/layout/posts-grid-layout";
import PostCard from "@/components/post/post-card";
import ProfileImage from "@/components/image/profile-image";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
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
import TextWithLimit from "@/components/text-with-limit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "My profile page",
};

export default function ProfilePage() {
  const { resp, isLoading, isSuccess } = useGetMyAccountInfo();
  const {
    myPosts,
    isLoading: isPostLoading,
    isSuccess: isPostSuccess,
    isFetching,
    isFetchNextNotAvailable,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyPosts();

  const { ref } = useFetchNextPageObserver({
    fetchNextPage,
    isDisabled: isFetchNextNotAvailable,
    isFetching,
  });

  const userPosts = myPosts?.data ?? [];
  const followers = resp?.data?.count?.followedBy ?? 0;
  const following = resp?.data?.count?.following ?? 0;
  const totalPost = resp?.data?.count?.posts ?? 0;

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        isSuccess && (
          <div className="w-full pt-2 flex flex-col items-center justify-start gap-2 relative">
            <CoverImage src={resp?.data?.profile?.coverImage?.src ?? ""} />
            <ProfileImage src={resp?.data?.profile?.avatarImage?.src ?? ""} />
            <div className="flex pt-20 md:pt-16 flex-col justify-start items-center w-full px-4 md:items-start md:px-6 md:pb-2">
              <div className="flex gap-2 flex-col md:items-start justify-start md:flex-shrink-0 max-w-full">
                <TypographyH3 className="text-center">
                  {resp?.data?.fullName}
                </TypographyH3>
                <TypographyMuted className="text-center">
                  {resp?.data?.username}
                </TypographyMuted>
                <TextWithLimit text={resp?.data?.profile?.description ?? ""} />
              </div>

              <ProfileInfo
                userId={resp?.data?.id ?? -1}
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
