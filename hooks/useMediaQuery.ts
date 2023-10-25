"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

interface Breakpoints {
  isXs: string;
  isSm: string;
  isMd: string;
  isLg: string;
  isXl: string;
  is2Xl: string;
}

interface BreakpointsBool {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
}

export const useBreakpoints = () => {
  const query: Breakpoints = {
    isXs: "(min-width: 0px) and (max-width: 639px)",
    isSm: "(min-width: 640px) and (max-width: 767px)",
    isMd: "(min-width: 768px) and (max-width: 1023px)",
    isLg: "(min-width: 1024px) and (max-width: 1279px)",
    isXl: "(min-width: 1280px) and (max-width: 1535px)",
    is2Xl: "(min-width: 1536px)",
  };

  const getMatches = (query: Breakpoints): BreakpointsBool => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      const matchMedia = (query: string): boolean =>
        window.matchMedia(query).matches;

      return {
        isXs: matchMedia(query.isXs),
        isSm: matchMedia(query.isSm),
        isMd: matchMedia(query.isMd),
        isLg: matchMedia(query.isLg),
        isXl: matchMedia(query.isXl),
        is2Xl: matchMedia(query.is2Xl),
      };
    }
    return {
      isXs: false,
      isSm: false,
      isMd: false,
      isXl: false,
      isLg: false,
      is2Xl: false,
    };
  };

  const [matches, setMatches] = useState<BreakpointsBool>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedias = Object.values(query).map((query) =>
      window.matchMedia(query)
    );

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    matchMedias.forEach((matchMedia) => {
      if (matchMedia.addListener) {
        matchMedia.addListener(handleChange);
      } else {
        matchMedia.addEventListener("change", handleChange);
      }
    });

    return () => {
      matchMedias.forEach((matchMedia) => {
        if (matchMedia.removeListener) {
          matchMedia.removeListener(handleChange);
        } else {
          matchMedia.removeEventListener("change", handleChange);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return matches;
};

export const useIsSm = () => useMediaQuery("(min-width: 640px)");
export const useIsMd = () => useMediaQuery("(min-width: 768px)");
export const useIsLg = () => useMediaQuery("(min-width: 1024px)");
export const useIsXl = () => useMediaQuery("(min-width: 1280px)");
export const useIs2Xl = () => useMediaQuery("(min-width: 1536px)");
