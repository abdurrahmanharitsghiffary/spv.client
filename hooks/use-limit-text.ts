"use client";

import { useCallback, useState } from "react";
import { useDynamicRef } from "./use-dynamic-ref";
import eol from "eol";
// DONE??
export const useLimitText = ({
  text = "",
  maxLines = 10,
}: {
  text: string;
  maxLines?: number;
}) => {
  const { refCb, ref } = useDynamicRef(null, text);
  const [isShowMore, setIsShowMore] = useState(false);
  const style = {
    webkitLineClamp: isShowMore ? "initial" : (maxLines - 1).toString(),
    webkitBoxOrient: "vertical",
    display: "-webkit-box",
    overflow: "hidden",
  } as React.CSSProperties;
  const offsetWidth = ref?.current?.offsetWidth ?? 0;
  const fontSize = ref?.current
    ? parseInt(window.getComputedStyle(ref?.current, null).fontSize)
    : 0;
  const maxFontPerRows = getMaxFontPerRow(offsetWidth, fontSize);
  const limit = maxFontPerRows * maxLines;
  const charLength = getCharLength(text, maxFontPerRows);
  const isExceedLimit = charLength > limit;

  let textContent: string | React.ReactNode = text;

  // if (isExceedLimit && !isShowMore)
  //   textContent = text.slice(0, showLimit).trimEnd() + "...";

  const onShow = useCallback(() => setIsShowMore(true), []);
  const onHide = useCallback(() => setIsShowMore(false), []);

  const onToggleShowMore = useCallback(() => setIsShowMore((c) => !c), []);

  return {
    ref: refCb,
    isExceedLimit,
    textContent,
    onHide,
    onShow,
    style,
    isShowMore,
    onToggleShowMore,
  };
};

const getMaxFontPerRow = (offsetWidth: number, fontSize: number) => {
  return Math.ceil(offsetWidth / fontSize);
};

const getCharLength = (text: string, maxFontPerRows: number): number => {
  const newText = eol.lf(text);
  let charLength = 0;
  let filledRows = 0;
  for (let i of newText) {
    if (filledRows >= maxFontPerRows) {
      filledRows = 0;
    }
    if (encodeURIComponent(i) === encodeURIComponent("\n")) {
      charLength += maxFontPerRows - filledRows;
      filledRows += maxFontPerRows - filledRows;
    } else {
      charLength += 1;
      filledRows += 1;
    }
  }
  return charLength;
};
