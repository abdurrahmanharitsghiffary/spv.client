import BottomBar from "@/components/bottombar";
import Layout from "@/components/layout/layout";
import PostMenu from "@/components/menu/post-menu";
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
      <main className="pb-0 pt-14 min-h-screen container mx-auto max-w-7xl flex-grow">
        <Layout>{children}</Layout>
      </main>
      <BottomBar />
      <PostMenu />
      <EditPostModal />
      <EditProfileModal />
    </EditProfileProvider>
  );
}
