"use client";

import { RefObject, useCallback, useState } from "react";

export const useDynamicRef = <T extends HTMLElement>() => {
  const [ref, setRef] = useState<RefObject<T>>({ current: null });

  const refCb = useCallback((node: T) => {
    setRef({ current: node });
  }, []);

  return { refCb, ref };
};
