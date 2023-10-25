"use client";
import { useEffect, useRef, useState } from "react";

export const useScrollValue = () => {
  const [scroll, setScroll] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;

    const onScroll = (e: Event) => {
      setScroll((c) => ({
        ...c,
        left: container?.scrollLeft ?? 0,
        top: container?.scrollTop ?? 0,
      }));
    };
    if (container) {
      container.addEventListener("scroll", onScroll);
    }
    return () => {
      if (container) container.removeEventListener("scroll", onScroll);
    };
  }, [scrollRef]);

  return { scroll, scrollRef };
};

export const useScrollWindowValue = () => {
  const [scrollValue, setScrollValue] = useState<{ x: number; y: number }>({
    y: 0,
    x: 0,
  });

  useEffect(() => {
    const onScroll = (e: Event) => {
      setScrollValue((c) => ({ ...c, x: window.scrollX, y: window.scrollY }));
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return scrollValue;
};
