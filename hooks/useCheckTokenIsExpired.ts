"use client";
import { useSession } from "@/stores/auth-store";
import React, { useEffect, useState } from "react";

export default function useCheckTokenIsExpired() {
  const session = useSession();
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.exp && Date.now() >= session?.exp * 1000) {
        return setIsExpired(true);
      }
      return setIsExpired(false);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [session?.exp]);

  return isExpired;
}
