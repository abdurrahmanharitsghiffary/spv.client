import JoinButton from "@/components/button/join-button";
import { listboxUserProps } from "@/components/user/listbox-user-props";
import { ChatRoomSimplified } from "@/types/chat";
import { Post } from "@/types/post";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import clsx from "clsx";
import React from "react";

export default function GroupsTab({
  groups,
  className,
}: {
  groups: ChatRoomSimplified[];
  className?: string;
}) {
  return (
    <Listbox
      aria-label="groups"
      items={groups}
      className={clsx("p-2", className)}
      classNames={{ list: "gap-4", emptyContent: "text-sm" }}
      emptyContent="No group found."
    >
      {(g) => (
        <ListboxItem
          textValue={g?.title ?? `Group chat ${g?.id}`}
          href={`/groups/${g?.id}`}
          key={g?.id}
          {...listboxUserProps({
            username: g?.description ?? "",
            avatarImage: g.picture,
            fullName: g?.title ?? `Group chat ${g?.id}`,
            id: g?.id!,
          } as any)}
          endContent={<JoinButton size="sm" groupId={g.id} />}
        />
      )}
    </Listbox>
  );
}
