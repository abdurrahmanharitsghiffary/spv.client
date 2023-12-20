import { CardBody } from "@nextui-org/card";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import PostContent from "./post-content";
import Link from "next/link";
import { PostExtended } from "@/types/post";
import Gallery from "../image/gallery";

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
      <Gallery images={postImages ?? []} />
    </CardBody>
  );
}
