import PhotoProfileMenu from "@/components/menu/photo-profile-menu";
import ProfileMenu from "@/components/menu/profile-menu";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProfileMenu />
      <PhotoProfileMenu />
    </>
  );
}
