"use client";

import { useLimitText } from "@/hooks/use-limit-text";
import clsx from "clsx";
import React, { useCallback } from "react";
import ShowMoreButton from "./button/show-more-button";

type Props = {
  maxLines?: number;
  text: string;
  className?: string;
  wrapperClassName?: string;
  showMoreButton?: (
    isShowMore: boolean,
    onToggleShowMore: (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => void
  ) => React.ReactNode;
};

export default function TextWithLimit({
  text,
  showMoreButton,
  wrapperClassName,
  maxLines = 10,
  className,
}: Props) {
  const {
    isExceedLimit,
    isShowMore,
    onToggleShowMore,
    ref,
    style,
    textContent,
  } = useLimitText({ text, maxLines });

  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();
      onToggleShowMore();
    },
    []
  );

  return (
    <div className={clsx("w-full", wrapperClassName)}>
      <p
        ref={ref as any}
        className={clsx(
          "max-w-full break-words whitespace-pre-wrap text-base",
          className
        )}
        style={style}
      >
        {textContent}
      </p>
      {isExceedLimit &&
        (showMoreButton ? (
          showMoreButton(isShowMore, handleButtonClick)
        ) : (
          <ShowMoreButton onClick={handleButtonClick} isShowMore={isShowMore} />
        ))}
    </div>
  );
}
