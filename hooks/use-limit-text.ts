"use client";

import { useCallback, useState } from "react";

export const useLimitText = ({
  text = "",
  limit = 300,
  showLimit = 270,
}: {
  text: string;
  limit?: number;
  showLimit?: number;
}) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const isExceedLimit = text.length > limit;

  let textContent = text;

  if (isExceedLimit && !isShowMore)
    textContent = text.slice(0, showLimit).trimEnd() + "...";

  const onShow = useCallback(() => setIsShowMore(true), []);
  const onHide = useCallback(() => setIsShowMore(false), []);

  const onToggleShowMore = useCallback(() => setIsShowMore((c) => !c), []);

  return {
    isExceedLimit,
    textContent,
    onHide,
    onShow,
    isShowMore,
    onToggleShowMore,
  };
};
