"use client";
import React, { useState } from "react";
import { CardBody } from "@nextui-org/card";
import ImageWithPreview from "../image/image-with-preview";
import { Link } from "@nextui-org/link";

export default function CommentBody({
  imageSrc,
  comment,
}: {
  imageSrc?: string;
  comment: string | undefined;
}) {
  const [isShowMore, setIsShowMore] = useState(false);
  const isExceedLimit = (comment ?? "").length > 200;

  let content: string = comment ?? "";

  if (isExceedLimit && !isShowMore)
    content = (comment ?? "").slice(0, 270).trimEnd() + "...";

  return (
    <CardBody className="text-sm p-0 my-3 w-fit max-w-full rounded-lg ml-[0.8rem] shadow-[0_0_7px_-1px_rgba(0,0,0,0)] pr-3">
      {imageSrc && (
        <ImageWithPreview
          removeWrapper
          src={imageSrc}
          radius="sm"
          className="min-w-[150px] max-w-[175px] h-auto my-1 object-cover"
        />
      )}
      {content}
      {isExceedLimit && (
        <Link
          as={"button"}
          color="foreground"
          className="text-xs pt-2"
          size="sm"
          underline="hover"
          onClick={() => setIsShowMore((c) => !c)}
        >
          {isShowMore ? "Show less" : "Show more"}
        </Link>
      )}
    </CardBody>
  );
}
