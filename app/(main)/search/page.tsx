import React, { Suspense } from "react";
import SearchTabs from "@/components/tabs/search-tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search something in here.",
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchTabs />
    </Suspense>
  );
}
