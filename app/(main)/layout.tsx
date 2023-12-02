import BottomBar from "@/components/bottombar";
import Giphy from "@/components/giphy";
import Layout from "@/components/layout/layout";
import ChatMenu from "@/components/menu/chat-menu";
import CommentMenu from "@/components/menu/comment-menu";
import PostMenu from "@/components/menu/post-menu";
import UserMenu from "@/components/menu/user-menu";
import EditPostModal from "@/components/modal/edit-post-modal";
import EditProfileModal from "@/components/modal/edit-profile-modal";
import ModalGif from "@/components/modal/modal-gif";
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
      <Giphy />
      <ModalGif />
      <UserMenu />
      <CommentMenu />
      <ChatMenu />
      <BottomBar />
      <PostMenu />
      <EditPostModal />
      <EditProfileModal />
    </EditProfileProvider>
  );
}
