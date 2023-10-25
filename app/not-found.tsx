"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function NotFoundGlobal() {
  const router = useRouter();

  useEffect(() => {
    router.push("/", { scroll: false });
  });

  return null;
}
