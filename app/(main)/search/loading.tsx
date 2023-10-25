import InputSearch from "@/components/input/search";

import React from "react";

export default function SearchLoading() {
  return (
    <div className="w-full pt-[42px]">
      <div className="fixed top-[13px] right-3 z-[41] left-3">
        <InputSearch radius="full" />
      </div>
    </div>
  );
}
