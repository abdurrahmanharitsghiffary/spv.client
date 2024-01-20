"use client";

import { DISCARD_CHANGE_CONFIRM_PROPS } from "@/lib/consts";
import { useConfirm } from "@/stores/confirm-store";
import { Button } from "@nextui-org/button";
import React, { useCallback } from "react";

export default function CancelButton({ onReset }: { onReset: () => void }) {
  const confirm = useConfirm();

  const handleCancel = useCallback(async () => {
    await confirm(DISCARD_CHANGE_CONFIRM_PROPS);
    onReset();
  }, [onReset]);

  return <Button onClick={handleCancel}>Cancel</Button>;
}
