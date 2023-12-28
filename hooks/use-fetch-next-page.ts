"use client";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { RefObject, useEffect, useRef, useState } from "react";

export default function useFetchNextPageObserver({
  isDisabled,
  fetchNextPage,
  isFetching,
}: // ref,
{
  isDisabled: boolean;
  isFetching: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;
  // ref?: RefObject<HTMLDivElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isObserving, setIsObserving] = useState(false);
  useEffect(() => {
    const element: HTMLDivElement | undefined | null = ref?.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsObserving(entry.isIntersecting);
        });
      },
      { threshold: 0.8 }
    );

    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref]);

  useEffect(() => {
    if (isObserving && !isDisabled && !isFetching) fetchNextPage();
  }, [isDisabled, isObserving, isFetching]);

  return { ref, isObserving };
}
