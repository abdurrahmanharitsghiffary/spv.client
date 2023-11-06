import { CardBody } from "@nextui-org/react";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import PostContent from "./post-content";
import Link from "next/link";
import PostGallery from "./post-gallery";
import { PostExtended } from "@/types/post";

export default function PostCardBody({
  isPostPage,
  isPreview,
  title,
  content,
  postId,
  postImages,
}: {
  isPostPage?: boolean;
  isPreview?: boolean;
  title: string;
  content: string;
  postId: number;
  postImages: PostExtended["images"];
}) {
  return (
    <CardBody className="gap-2">
      {isPostPage || isPreview ? (
        <div>
          <TypographyH4>{title}</TypographyH4>
          <PostContent content={content} />
        </div>
      ) : (
        <Link href={`/posts/${postId}`}>
          <TypographyH4>{title}</TypographyH4>
          <PostContent content={content} />
        </Link>
      )}
      <PostGallery images={postImages} />
    </CardBody>
  );
}
