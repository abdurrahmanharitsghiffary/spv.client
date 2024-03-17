import SavedPostsPage from "@/components/page/saved-posts-page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Saved posts",
  description: "Saved posts page",
};

export default function SavedPostPage() {
  return <SavedPostsPage />;
}
