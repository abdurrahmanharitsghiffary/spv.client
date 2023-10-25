"use client";
import { useEffect, useState } from "react";

export default function usePermission(query: PermissionName | string) {
  const [permission, setPermission] = useState<PermissionStatus | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window) {
      navigator.permissions
        .query({ name: query as any })
        .then((res) => setPermission(res))
        .catch((err) => console.error(err));
    }
  }, [query]);

  return permission;
}
