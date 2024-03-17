import React from "react";
import GroupPage from "@/components/page/group-page";
import { Metadata } from "next";

export function generateMetadata({ params }: any): Metadata {
  return {
    title: `Group - ${params?.groupId}`,
    keywords: "Groups, Group",
    category: "Groups",
  };
}

export default function Page({ params }: { params: { groupId: string } }) {
  return <GroupPage groupId={Number(params.groupId)} />;
}
