import Dropdown from "@/components/dropdown";
import InputSearch from "@/components/input/search";
import NotificationCard from "@/components/notification";
import { TypographyH3 } from "@/components/ui/typography";
import { NotificationType } from "@/types";
import { Button } from "@nextui-org/button";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiFilter } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
export default function NotificationPage() {
  return (
    <>
      <div className="pt-4 flex flex-col gap-2 w-full px-2">
        <TypographyH3 className="my-2">Notifications</TypographyH3>
        <div className="w-full flex gap-2">
          <InputSearch autoFocus={false} />
          <Dropdown
            items={[
              { key: "new", label: "Newest" },
              { key: "old", label: "Oldest" },
            ]}
          >
            <Button isIconOnly color="secondary">
              <BiFilter size={20} />
            </Button>
          </Dropdown>
          <Dropdown
            items={[
              {
                key: "1h-delete",
                label: "Delete all notifications from 1 hour ago",
              },
              {
                key: "1d-delete",
                label: "Delete all notifications from 1 day ago",
              },
              { key: "all-delete", label: "Delete all notifications" },
            ]}
          >
            <Button isIconOnly color="danger">
              <AiOutlineDelete size={20} />
            </Button>
          </Dropdown>
        </div>

        <Button color="primary" endContent={<IoCheckmarkDoneSharp size={20} />}>
          Mark all as read
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 w-full px-2 pt-4 pb-16">
        {(
          [
            "comment",
            "comment",
            "follow",
            "liking_comment",
            "liking_post",
            "replying_comment",
            "liking_post",
            "follow",
            "liking_comment",
            "replying_comment",
          ] as NotificationType[]
        ).map((notification, i) => (
          <NotificationCard
            key={notification + i}
            type={notification}
            isReaded={i === 2 || i === 7 || i === 1 || i === 8}
          />
        ))}
      </div>
    </>
  );
}
