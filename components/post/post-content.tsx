"use client";

import React, { useMemo, useState } from "react";
import { TypographyP } from "../ui/typography";
import { Link } from "@nextui-org/link";

export default function PostContent({
  content,
}: {
  content: string | undefined;
}) {
  const [isShowMore, setIsShowMore] = useState(false);

  const isExceedLimit = (content ?? "").length > 300;

  const postContent = useMemo(() => {
    const str = content ?? "";

    if (!isExceedLimit) return str;
    if (isShowMore) return str;
    return str.slice(0, 270).trimEnd() + "...";
  }, [isExceedLimit, isShowMore, content]);
  return (
    <>
      <TypographyP className="max-w-full break-words whitespace-normal !mt-0">
        {postContent}
      </TypographyP>
      {isExceedLimit && (
        <Link
          as={"span"}
          size="sm"
          className="text-sm pt-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsShowMore((c) => !c);
          }}
        >
          {isShowMore ? "Show less" : " Show more"}
        </Link>
      )}
    </>
  );
}
