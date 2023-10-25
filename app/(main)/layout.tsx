import BottomBar from "@/components/bottombar";
import Layout from "@/components/layout/layout";
import EditPostModal from "@/components/modal/edit-post-modal";
import EditProfileModal from "@/components/modal/edit-profile-modal";
import Navbar from "@/components/navbar";
import EditProfileProvider from "@/context/edit-profile-context";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditProfileProvider>
      <Navbar />
      <main className="pt-14 pb-0 container mx-auto max-w-7xl flex-grow">
        <Layout>{children}</Layout>
      </main>
      <BottomBar />
      <EditPostModal />
      <EditProfileModal />
    </EditProfileProvider>
  );
}
