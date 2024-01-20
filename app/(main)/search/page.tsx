import React, { Suspense } from "react";
import SearchTabs from "@/components/tabs/search-tabs";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchTabs />
    </Suspense>
  );
}
