import ChatBubble from "@/components/chat/chat-bubble";
import ChatForm from "@/components/form/chat-form";
import React from "react";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  return (
    <>
      <div
        className="pt-5 flex flex-col gap-5 px-4 w-full pb-20"
        // style={{
        //   backgroundSize: "100%",
        //   backgroundImage:
        //     "url('https://images.unsplash.com/photo-1695606392987-9635caaf7f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        // }}
      >
        {[
          "Hey kontolosse",
          "Halo dynamise",
          "Are you fine?",
          "I am fain thankiyu",
          "Okay okay",
          "Did you already complete the yesterday assigment?",
          "Yeah about 50% maybe",
          "Can i take a look",
          "Please??",
          "Sure",
          "Wtf don't playin with me 🤬",
          "LOLOLOLOLOLOLOLOLOLOLOLOLOL",
        ].map((txt, it) => (
          <ChatBubble
            text={txt}
            key={txt}
            image={
              it === 9
                ? "https://images.unsplash.com/photo-1695606392987-9635caaf7f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                : ""
            }
            isRecipient={[0, 2, 4, 5, 7, 8, 10].some((ite) => ite === it)}
          />
        ))}
      </div>
      <ChatForm />
    </>
  );
}
