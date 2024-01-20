"use client";

import { RefObject, useEffect, useState } from "react";

export const useIsSticky = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSticky(entry.isIntersecting);
        });
      },
      {
        rootMargin: "-1px 0px 0px 0px",
        threshold: [1],
      }
    );
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref]);

  return isSticky;
};
