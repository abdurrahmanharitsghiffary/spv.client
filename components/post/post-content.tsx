"use client";

import React, { useState } from "react";
import { TypographyP } from "../ui/typography";
import { Link } from "@nextui-org/link";
import { useLimitText } from "@/hooks/use-limit-text";

export default function PostContent({
  content,
}: {
  content: string | undefined;
}) {
  const { textContent, isExceedLimit, isShowMore, onToggleShowMore } =
    useLimitText({ text: content ?? "" });
  // const [isShowMore, setIsShowMore] = useState(false);

  // const isExceedLimit = (content ?? "").length > 300;

  // let postContent = content ?? "";

  // if (isExceedLimit && !isShowMore)
  //   postContent = (content ?? "").slice(0, 270).trimEnd() + "...";

  return (
    <>
      <TypographyP className="max-w-full break-words whitespace-normal !mt-0">
        {textContent}
      </TypographyP>
      {isExceedLimit && (
        <Link
          as={"span"}
          size="sm"
          className="text-sm pt-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleShowMore();
          }}
        >
          {isShowMore ? "Show less" : " Show more"}
        </Link>
      )}
    </>
  );
}
