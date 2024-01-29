import { CardBody } from "@nextui-org/card";
import React from "react";
import { TypographyH4 } from "../ui/typography";
import Link from "next/link";
import { Post } from "@/types/post";
import Gallery from "../image/gallery";
import TextWithLimit from "../text-with-limit";

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
  postImages: Post["images"];
}) {
  return (
    <CardBody className="gap-2">
      {isPostPage || isPreview ? (
        <div>
          <TypographyH4>{title}</TypographyH4>
          <TextWithLimit text={content} />
        </div>
      ) : (
        <Link href={`/posts/${postId}`}>
          <TypographyH4>{title}</TypographyH4>
          <TextWithLimit text={content} />
        </Link>
      )}
      <Gallery images={postImages ?? []} />
    </CardBody>
  );
}
