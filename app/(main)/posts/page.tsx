import CreatePostForm from "@/components/form/create-post-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create post",
  description: "Create your post here",
};

export default function PostPage() {
  return <CreatePostForm autoFocus />;
}
