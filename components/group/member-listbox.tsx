import { ChatRoomParticipant } from "@/types/chat";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React from "react";
import { listboxUserProps } from "../user/listbox-user-props";
import ParticipantMenuTrigger from "../menu/participant-menu/trigger";
import MemberRole from "./member-role";

export default function MemberListbox({
  members,
}: {
  members: ChatRoomParticipant[];
}) {
  return (
    <Listbox items={members} classNames={{ list: "gap-2" }}>
      {(member) => (
        <ListboxItem
          key={member?.id}
          {...listboxUserProps({
            avatarImage: member?.avatarImage,
            firstName: member?.firstName,
            fullName: member?.fullName,
            id: member?.id,
            isOnline: member?.isOnline,
            lastName: member?.lastName,
            username: member?.username,
          })}
          endContent={
            <div className="flex flex-col gap-1 items-end">
              <ParticipantMenuTrigger participantId={member?.id} />
              <MemberRole role={member?.role} />
            </div>
          }
        />
      )}
    </Listbox>
  );
}
