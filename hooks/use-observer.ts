"use client";
import { RefObject, useEffect, useState } from "react";

export const useObserver = (
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit
) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) setIsInView(false);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        }),
      options
    );
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return isInView;
};
