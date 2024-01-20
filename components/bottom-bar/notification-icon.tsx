"use client";

import { useNotificationCount } from "@/stores/count-store";
import { Badge } from "@nextui-org/badge";
import React from "react";
import { FiBell } from "react-icons/fi";

export default function NotificationIcon({ isActive }: { isActive?: boolean }) {
  const count = useNotificationCount();

  return (
    <Badge
      content={count.toString()}
      classNames={{ base: "!block" }}
      color="danger"
      isInvisible={count === 0}
    >
      {isActive ? <FiBell stroke="#0070F0" size={20} /> : <FiBell size={20} />}
    </Badge>
  );
}
