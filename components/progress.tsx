import React from "react";
import { Progress as ProgressBase } from "@nextui-org/progress";

export default function Progress() {
  return (
    <div className="inset-0 fixed bg-overlay/50 flex z-[9999]">
      <ProgressBase isIndeterminate size="sm" aria-label="Loading..." />
    </div>
  );
}
