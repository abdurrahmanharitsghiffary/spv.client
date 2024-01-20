import React from "react";
import { CardBody } from "@nextui-org/card";
import ImageWithPreview from "../image/image-with-preview";
import TextWithLimit from "../text-with-limit";

export default function CommentBody({
  imageSrc,
  comment,
}: {
  imageSrc?: string;
  comment: string | undefined;
}) {
  return (
    <CardBody className="text-sm p-0 my-3 w-fit max-w-full rounded-lg ml-[0.8rem] shadow-[0_0_7px_-1px_rgba(0,0,0,0)] pr-3 !whitespace-pre-wrap">
      {imageSrc && (
        <ImageWithPreview
          removeWrapper
          src={imageSrc}
          radius="sm"
          className="min-w-[150px] max-w-[175px] h-auto my-1 object-cover"
        />
      )}
      <TextWithLimit text={comment ?? ""} maxLines={8} />
    </CardBody>
  );
}
