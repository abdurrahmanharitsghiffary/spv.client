import ChatForm from "@/components/form/chat-form";
import React from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="pt-5 flex flex-col gap-5 px-4 w-full max-w-sm pb-20"
        // style={{
        //   backgroundSize: "100%",
        //   backgroundImage:
        //     "url('https://images.unsplash.com/photo-1695606392987-9635caaf7f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        // }}
      >
        {children}
      </div>
      <ChatForm />
    </>
  );
}
