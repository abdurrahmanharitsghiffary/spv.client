"use client";
import SpaceVerseApi from "@/lib/api";
import { useSetSession } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const api = new SpaceVerseApi();

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setSession = useSetSession();
  const router = useRouter();

  useEffect(() => {
    let controller = new AbortController();

    api
      .refreshAccessToken({ signal: controller.signal })
      .then((res) => {
        const response = res.data.data;
        if (response?.access_token) {
          const accessToken = response?.access_token;
          setSession({
            ...JSON.parse(atob(accessToken.split(".")?.[1])),
            accessToken,
          });
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message === "You are unauthenticated!") {
          router.push("/login");
        }
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
