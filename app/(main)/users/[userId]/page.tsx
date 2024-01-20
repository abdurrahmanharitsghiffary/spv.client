"use client";
import CoverImage from "@/components/image/cover-image";
import ProfileImage from "@/components/image/profile-image";
import PostsGridLayout from "@/components/layout/posts-grid-layout";
import PostCard from "@/components/post/post-card";
import PostCardSkeleton from "@/components/post/skeleton";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import TextWithLimit from "@/components/text-with-limit";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import UserActionButton from "@/components/user/user-action-button";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { useNotFoundRedirect } from "@/hooks/use-not-found-redirect";
import { useGetPostByUserId } from "@/lib/api/posts/query";
import { useGetUserById } from "@/lib/api/users/query";
import { useSession } from "@/stores/auth-store";
import { PostExtended } from "@/types/post";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function UserPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.id === Number(params.userId)) router.replace("/profile");
  }, [session]);

  const { userData, isLoading, isSuccess, isError, error } = useGetUserById(
    Number(params?.userId)
  );
  const {
    posts,
    isLoading: isPostsLoad,
    isSuccess: isPostsSuccess,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextNotAvailable,
  } = useGetPostByUserId(Number(params.userId));

  useNotFoundRedirect(error, isError);

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable || isError,
    fetchNextPage,
    isFetching,
  });

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        isSuccess && (
          <div className="w-full pt-2 flex flex-col items-center justify-start gap-2 relative">
            <CoverImage
              src={userData?.data?.profile?.coverImage?.src ?? ""}
              className="pt-2"
            />
            <ProfileImage
              isNotOwned
              src={userData?.data?.profile?.avatarImage?.src ?? ""}
            />
            <div className="flex pt-20 md:pt-16 flex-col justify-start items-center w-full px-4 md:items-start md:px-6 md:pb-2">
              <div className="flex gap-2 flex-col md:items-start justify-start md:flex-shrink-0 max-w-full break-words">
                <TypographyH3 className="text-center">
                  {userData?.data?.fullName ?? ""}
                </TypographyH3>
                <TypographyMuted className="text-center md:!text-base">
                  {userData?.data?.username ?? ""}
                </TypographyMuted>
                <TextWithLimit
                  text={userData?.data?.profile?.description ?? ""}
                />
              </div>

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
