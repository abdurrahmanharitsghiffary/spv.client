import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
} from "@nextui-org/card";
import React from "react";

import Link from "next/link";
import { TypographyH4, TypographyP } from "../ui/typography";
import PostGallery from "./post-gallery";
import PostDropdown from "./post-dropdown";
import PostActionButton from "./action-button";
import { Divider } from "@nextui-org/divider";
import User from "../user/user";
import { PostExtended } from "@/types/post";
import PostMenuTrigger from "../menu/post-menu/trigger";

interface PostCardProps {
  post: PostExtended | undefined;
}

export default function PostCard(
  props: CardProps & {
    isPostPage?: boolean;
    isPreview?: boolean;
  } & PostCardProps
) {
  const { post } = props;
  const style = `${
    props.className ?? ""
  } rounded-none w-full dark:border-t-0 border-b-1 last:border-b-0 dark:border-b-0 border-divider shadow-none`;
  const title = post?.title ?? "";
  const content = post?.content ?? "";

  return (
    <Card className={style} {...props} shadow="none" radius="none">
      <CardHeader className="flex justify-between">
        <User
          createdAt={post?.createdAt}
          user={post?.author}
          isPreview={props?.isPreview}
        />
        <PostMenuTrigger post={post as PostExtended} />
      </CardHeader>
      <CardBody className="gap-2">
        {props?.isPostPage || props?.isPreview ? (
          <div>
            <TypographyH4>{title}</TypographyH4>
            <TypographyP className="max-w-full break-words whitespace-normal !mt-0">
              {content}
            </TypographyP>
          </div>
        ) : (
          <Link href={`/posts/${post?.id}`}>
            <TypographyH4>{title}</TypographyH4>
            <TypographyP className="max-w-full break-words whitespace-normal !mt-0">
              {content}
            </TypographyP>
          </Link>
        )}
        <PostGallery images={post?.images ?? []} />{" "}
      </CardBody>
      <Divider />
      <CardFooter className="py-2">
        <PostActionButton
          post={post}
          isPostPage={props?.isPostPage}
          isPreview={props?.isPreview}
        />
      </CardFooter>
    </Card>
  );
}
