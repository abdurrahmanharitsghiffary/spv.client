import ChatForm from "@/components/form/chat-form";
import ChatEditForm from "@/components/form/chat-form/edit-form";
import MessageMenu from "@/components/menu/message-menu";
import MessageDetailsModal from "@/components/modal/message-details-modal";
import MessageEditFormProvider from "@/context/message-edit-form-context";
import MessageInfoProvider from "@/context/message-info-context";
import React from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessageEditFormProvider>
      <MessageInfoProvider>
        <div
          className="pt-5 flex flex-col gap-5 px-4 w-full pb-4 md:pb-20 sm:pl-[316px] lg:pl-[416px]"
          // style={{
          //   backgroundSize: "100%",
          //   backgroundImage:
          //     "url('https://images.unsplash.com/photo-1695606392987-9635caaf7f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          // }}
        >
          {children}
        </div>
        <ChatForm />
        <MessageDetailsModal />
        <MessageMenu />
        <ChatEditForm />
      </MessageInfoProvider>
    </MessageEditFormProvider>
  );
}
