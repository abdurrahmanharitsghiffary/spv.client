import { useEffect } from "react";

export const useBodyOverflowHidden = (reactiveValue: boolean) => {
  useEffect(() => {
    if (reactiveValue) document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [reactiveValue]);
};
