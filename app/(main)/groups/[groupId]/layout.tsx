import ParticipantMenu from "@/components/menu/participant-menu";
import EditGroupModal from "@/components/modal/edit-group-modal";
import React from "react";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full pt-12 flex flex-col gap-4">{children}</div>
      <EditGroupModal />
      <ParticipantMenu />
    </>
  );
}
