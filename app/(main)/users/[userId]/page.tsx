"use client";
import CoverImage from "@/components/image/cover-image";
import ProfileImage from "@/components/image/profile-image";
import PostsGridLayout from "@/components/layout/posts-grid-layout";
import PostCard from "@/components/post/post-card";
import PostCardSkeleton from "@/components/post/skeleton";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import UserActionButton from "@/components/user/user-action-button";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useGetPostByUserId } from "@/lib/api/posts/query";
import { useGetUserById } from "@/lib/api/users/query";
import { PostExtended } from "@/types/post";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import React from "react";

export default function UserPage({ params }: { params: { userId: string } }) {
  const { userData, isLoading, isSuccess } = useGetUserById(
    Number(params.userId)
  );
  const {
    posts,
    isLoading: isPostsLoad,
    isSuccess: isPostsSuccess,
    fetchNextPage,
    data,
    isFetching,
    isFetchingNextPage,
  } = useGetPostByUserId(Number(params.userId));

  const isDisabled =
    data?.pageParams.some((params) => params === null) ?? false;
  const { ref } = useFetchNextPageObserver({
    isDisabled,
    fetchNextPage,
    isFetching,
  });

  const fullName = `${userData?.data?.firstName ?? ""} ${
    userData?.data?.lastName ?? ""
  }`;

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        isSuccess && (
          <div className="w-full pt-2 flex flex-col items-center justify-start gap-2 relative">
            <CoverImage
              src={userData?.data?.profile?.coverImage?.src ?? ""}
              className="mb-20 pt-2"
            />
            <ProfileImage
              isNotOwned
              src={userData?.data?.profile?.image?.src ?? ""}
            />
            <div className="flex flex-col justify-start items-center w-full px-4">
              <TypographyH3 className="text-center">
                {fullName ?? ""}
              </TypographyH3>
              <TypographyMuted className="text-center">
                {userData?.data?.username ?? ""}
              </TypographyMuted>

              <ProfileInfo
                userId={Number(params.userId)}
                postCount={posts?.pagination?.total_records ?? 0}
                followedCount={userData?.data?.following?.total ?? 0}
                followersCount={userData?.data?.followedBy?.total ?? 0}
              />
            </div>
            <UserActionButton userId={userData?.data?.id ?? -1} />
          </div>
        )
      )}
      <Divider className="mt-7" />
      <PostsGridLayout>
        {isPostsLoad
          ? [1, 2].map((item) => <PostCardSkeleton key={item} />)
          : isPostsSuccess &&
            posts?.data?.map((data: PostExtended) => (
              <PostCard post={data} key={data?.id} />
            ))}
        {isFetchingNextPage && <Spinner className="mt-4" />}
        <div ref={ref} className="w-full"></div>
      </PostsGridLayout>
    </>
  );
}
