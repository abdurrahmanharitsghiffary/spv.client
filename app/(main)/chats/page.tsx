import ChatDisplay from "@/components/chat/chat-display";
import ChatAvatar from "@/components/chat/chat-avatar";
import Slider from "@/components/slider";
import { TypographyH4 } from "@/components/ui/typography";
import { Input } from "@nextui-org/input";
import React from "react";
import { FiSearch } from "react-icons/fi";

export default function ChatsPage() {
  return (
    <div className="w-full flex flex-col gap-1 p-4 pt-5 pb-16">
      <div className="flex flex-col gap-2">
        <TypographyH4>Active users</TypographyH4>
        <Slider>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((u) => (
            <ChatAvatar key={u} isOnline />
          ))}
        </Slider>
      </div>
      <Input
        type="search"
        startContent={<FiSearch size={20} />}
        placeholder="Search users..."
        className="my-2"
        fullWidth
      />
      <div className="flex flex-col gap-3 w-full">
        <TypographyH4>All Chats</TypographyH4>
        <ChatDisplay isOnline />
        <ChatDisplay isOnline />
        <ChatDisplay isOnline />
        {[1, 2, 3, 4, 5].map((c) => (
          <ChatDisplay key={c} />
        ))}
      </div>
    </div>
  );
}
