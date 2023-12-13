import Link from "next/link";
import UserAvatar from "../user/user-avatar";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Time from "../time";
import { ChatRoomParticipant } from "@/types/chat";
import clsx from "clsx";
import ParticipantMenuTrigger from "../menu/participant-menu/trigger";

export default function ChatParticipant({
  participant,
}: {
  participant: ChatRoomParticipant;
}) {
  return (
    <div className="flex gap-1 w-full px-4 justify-between last:border-none border-b-1 border-divider py-2 max-h-[65px]">
      <div className="flex justify-center items-center w-fit flex-shrink-0">
        <UserAvatar
          name={participant?.fullName ?? ""}
          src={participant?.avatarImage?.src}
          isOnline={participant?.isOnline}
        />
      </div>
      <div className="flex gap-2 w-[80%] justify-between">
        <Link
          href={`/users/${participant?.id}`}
          className="flex flex-col max-w-[80%] w-[80%] truncate justify-center"
        >
          <div className="flex gap-3 items-start max-h-full">
            <TypographyLarge className="!text-base !font-semibold truncate">
              {participant?.fullName}
            </TypographyLarge>
          </div>
          <TypographyMuted className="!text-xs truncate">
            {participant?.username}
          </TypographyMuted>
        </Link>
        <div className="flex flex-col gap-1 justify-center items-end">
          {participant?.role !== "user" && (
            <span
              className={clsx(
                "text-tiny rounded-sm py-[1px] px-2 text-center capitalize",
                participant?.role === "admin" &&
                  "text-success-foreground bg-success/80",
                participant?.role === "creator" &&
                  "bg-secondary/80 text-secondary-foreground"
              )}
            >
              {participant?.role}
            </span>
          )}
          <ParticipantMenuTrigger participantId={participant?.id} />
        </div>
      </div>
    </div>
  );
}
