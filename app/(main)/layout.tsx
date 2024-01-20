import BottomBar from "@/components/bottom-bar";
import Giphy from "@/components/giphy";
import Layout from "@/components/layout/layout";
import ChatMenu from "@/components/menu/chat-menu";
import CommentMenu from "@/components/menu/comment-menu";
import GroupMenu from "@/components/menu/group-menu";
import PostMenu from "@/components/menu/post-menu";
import UserMenu from "@/components/menu/user-menu";
import CommentLikesModal from "@/components/modal/comment-likes-modal";
import EditPostModal from "@/components/modal/edit-post-modal";
import EditProfileModal from "@/components/modal/edit-profile-modal";
import ModalGif from "@/components/modal/modal-gif";
import PostLikesModal from "@/components/modal/post-likes-modal";
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
      <main className="pb-14 md:pb-0 pt-14 min-h-[100dvh] container mx-auto max-w-7xl flex-grow">
        <Layout>{children}</Layout>
      </main>
      <Giphy />
      <ModalGif />
      <UserMenu />
      <CommentMenu />
      <ChatMenu />
      <BottomBar />
      <PostMenu />
      <GroupMenu />
      <CommentLikesModal />
      <PostLikesModal />
      <EditPostModal />
      <EditProfileModal />
    </EditProfileProvider>
  );
}
