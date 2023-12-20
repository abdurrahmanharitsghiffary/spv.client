"use client";

import React from "react";
import ModalLayoutV2 from "../layoutV2";
import { useMessageInfoDisclosure } from "@/context/message-info-context";

export default function MessageDetailsModal() {
  const { isOpen, onClose } = useMessageInfoDisclosure();

  return (
    <ModalLayoutV2 isOpen={isOpen} onClose={onClose}>
      MessageDetailsModal
    </ModalLayoutV2>
  );
}
