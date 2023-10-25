import React from "react";

export default function Slider({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto hide-scrollbar w-full">
      <div className="flex gap-6 items-center">{children}</div>
    </div>
  );
}
