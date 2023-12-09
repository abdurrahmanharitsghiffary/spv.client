import React from "react";
import GroupPage from "@/components/page/group-page";

export default function Page({ params }: { params: { groupId: string } }) {
  return <GroupPage groupId={Number(params.groupId)} />;
}
