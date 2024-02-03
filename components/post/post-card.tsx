import { Card, CardProps } from "@nextui-org/card";
import React, { memo } from "react";
import { Divider } from "@nextui-org/divider";
import { Post } from "@/types/post";
import PostCardHeader from "./post-card-header";
import PostCardBody from "./post-card-body";
import PostCardFooter from "./post-card-footer";

interface PostCardProps {
  post: Post | undefined;
}

function PostCard(
  props: CardProps & {
    isPostPage?: boolean;
    isPreview?: boolean;
  } & PostCardProps
) {
  const { post, isPreview, isPostPage } = props;
  const style = `${
    props.className ?? ""
  } rounded-none w-full dark:border-t-0 border-b-1 last:border-b-0 dark:border-b-0 border-divider shadow-none`;
  const title = post?.title ?? "";
  const content = post?.content ?? "";
  // USE MEMO ??
  const images = post?.images ?? [];
  // USE MEMO ??
  const author = post?.author;

  const postId = { authorId: post!?.author?.id, id: post!?.id };
  if (!post) return null;
  return (
    <Card className={style} {...props} shadow="none" radius="none">
      <PostCardHeader
        author={author}
        createdAt={post!?.createdAt}
        isPreview={isPreview}
        postId={postId}
      />
      <PostCardBody
        content={content}
        title={title}
        postId={post?.id}
        postImages={images}
        isPostPage={isPostPage}
        isPreview={isPreview}
      />
      <Divider />
      <PostCardFooter
        postId={post?.id}
        totalComments={post?.total_comments ?? 0}
        isPostPage={isPostPage}
        isPreview={isPreview}
      />
    </Card>
  );
}

export default memo(PostCard);
