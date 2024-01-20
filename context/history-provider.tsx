"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type History = { prev: string | null; history: string[] };

export const HistoryContext = createContext<History>({} as History);

export default function HistoryProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [history, setHistory] = useState<History>({ prev: null, history: [] });
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const currentLink = useMemo(() => getLink(pathname), [pathname]);
  const prevLink = useRef<null | string>(null);

  //   console.log(currentLink, "Current link");
  //   console.log(prevLink.current, "Previous link");

  useEffect(() => {
    const prev = prevLink.current;
    if (prev)
      setHistory((c) => ({ ...c, prev, history: [...c.history, prev] }));
    return () => {
      if (isMounted) prevLink.current = currentLink;
    };
  }, [currentLink, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <HistoryContext.Provider value={history}>
      {children}
    </HistoryContext.Provider>
  );
}

const getLink = (path: string, params?: URLSearchParams) => {
  const newUrl = new URL(path, "http://localhost:3000");
  if (params)
    params.forEach((v, k) => {
      newUrl.searchParams.set(k, v);
    });

  return newUrl.href.split(":3000")?.[1];
};
