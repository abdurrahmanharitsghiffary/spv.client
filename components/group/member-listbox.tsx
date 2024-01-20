import { ChatRoomParticipant } from "@/types/chat";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import React from "react";
import { listboxUserProps } from "../user/listbox-user-props";
import ParticipantMenuTrigger from "../menu/participant-menu/trigger";
import MemberRole from "./member-role";
import clsx from "clsx";

export default function MemberListbox({
  members,
}: {
  members: ChatRoomParticipant[];
}) {
  return (
    <Listbox
      items={members}
      classNames={{ list: "gap-2" }}
      aria-label="group members"
    >
      {(member) => {
        const props = listboxUserProps({
          avatarImage: member?.avatarImage,
          firstName: member?.firstName,
          fullName: member?.fullName,
          id: member?.id,
          isOnline: member?.isOnline,
          lastName: member?.lastName,
          username: member?.username,
        });
        return (
          <ListboxItem
            textValue={member.fullName!}
            key={member?.id}
            {...props}
            classNames={{
              ...props.classNames,
              title: clsx(
                props.classNames?.title,
                "flex gap-2 justify-between"
              ),
            }}
            endContent={<ParticipantMenuTrigger participantId={member?.id} />}
          >
            <span className="flex-1 truncate">{member?.fullName}</span>
            <MemberRole className="flex-shrink-0" role={member?.role} />
          </ListboxItem>
        );
      }}
    </Listbox>
  );
}
