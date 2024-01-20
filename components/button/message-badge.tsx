"use client";

import { useMessageCount } from "@/stores/count-store";
import { Badge } from "@nextui-org/badge";
import React from "react";

export default function MessageBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  const count = useMessageCount();

  const content = count > 99 ? "99+" : count;

  return (
    <Badge size="md" color="danger" content={content} isInvisible={count === 0}>
      {children}
    </Badge>
  );
}
