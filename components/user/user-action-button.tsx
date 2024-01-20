import { Button } from "@nextui-org/button";
import FollowButton from "../button/follow-button";
import Link from "next/link";
import UserMenuTrigger from "../menu/user-menu/trigger";

export default function UserActionButton({ userId }: { userId: number }) {
  return (
    <div className="flex gap-4 items-center w-full px-4">
      <FollowButton userId={userId} className="flex-1 font-semibold" />
      <Button
        as={Link}
        href={`/chats`}
        className="font-semibold flex-1"
        radius="md"
      >
        Message
      </Button>
      <UserMenuTrigger />
    </div>
  );
}
