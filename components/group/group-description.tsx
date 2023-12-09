"use client";

import { useLimitText } from "@/hooks/use-limit-text";
import { TypographyP } from "../ui/typography";
import ShowMoreButton from "../button/show-more-button";

export default function GroupDescription({
  description,
}: {
  description: string;
}) {
  const { textContent, isExceedLimit, isShowMore, onToggleShowMore } =
    useLimitText({ text: description, limit: 240 });

  return (
    <div className="text-base text-center">
      <TypographyP className="text-center !text-inherit !mt-0 inline">
        {textContent}
      </TypographyP>
      {isExceedLimit && (
        <>
          {" "}
          <ShowMoreButton
            as={"p"}
            isShowMore={isShowMore}
            onClick={onToggleShowMore}
            className="!text-base inline"
          />
        </>
      )}
    </div>
  );
}
