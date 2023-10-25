"use client";
import { useEffect, useState } from "react";

export const useGetWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const onResize = (e: UIEvent) => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
    }

    return () => {
      if (typeof window !== "undefined")
        window.removeEventListener("resize", onResize);
    };
  }, []);

  return windowWidth;
};
