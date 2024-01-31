"use client";

import { RefObject, useCallback, useState } from "react";

export const useDynamicRef = <T extends HTMLElement>(
  value?: T | null,
  deps?: any
) => {
  const [ref, setRef] = useState<RefObject<T>>({ current: value ?? null });

  const refCb = useCallback(
    (node: T) => {
      if (node) setRef((c) => ({ ...c, current: node }));
    },
    [deps]
  );

  return { refCb, ref };
};
