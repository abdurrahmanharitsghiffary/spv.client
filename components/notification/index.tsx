import { NotificationType } from "@/types";
import React from "react";
import { Notification } from "@/types/notification";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import {
  listboxUserBaseProps,
  listboxUserProps,
} from "../user/listbox-user-props";
import moment from "moment";
import clsx from "clsx";

const getContent = (type: NotificationType) => {
  switch (type) {
    case "comment": {
      return "commented on your post";
    }
    case "follow": {
      return "started following you";
    }
    case "liking_post": {
      return "liked your recent post";
    }
    case "liking_comment": {
      return "liked your comment";
    }
    case "replying_comment": {
      return "replied your comment on a post...";
    }
    case "accepted_group_application": {
      return "Your membership request has been approved.";
    }
    case "rejected_group_application": {
      return "Your membership request has been rejected.";
    }
    default: {
      return "";
    }
  }
};

const getLink = (notification: Notification) => {
  if (
    notification.type === "comment" ||
    notification.type === "liking_comment" ||
    notification.type === "replying_comment"
  ) {
    return `/comments/${notification.commentId}`;
  } else if (notification.type === "liking_post") {
    return `/posts/${notification.postId}`;
  } else if (notification.type === "follow") {
    return `/users/${notification.senderId}`;
  } else if (
    notification.type === "rejected_group_application" ||
    notification.type === "accepted_group_application"
  ) {
    return `/groups/${notification.groupId}`;
  }
  return "/";
};

export default function NotificationLists({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <Listbox
      items={notifications}
      className="p-2"
      emptyContent="No new notification."
      classNames={{ list: "gap-2" }}
    >
      {(notification) => {
        const text = getContent(notification.type);
        const href = getLink(notification);
        return (
          <ListboxItem
            className={clsx("bg-content1")}
            key={notification.id}
            classNames={{
              ...listboxUserBaseProps.classNames,
              title: clsx(
                "inline !text-clip !whitespace-normal",
                notification.isRead && "!line-through"
              ),
            }}
            startContent={listboxUserProps(notification.sender).startContent}
            description={moment(notification.createdAt).fromNow()}
            href={href}
          >
            {notification.sender.fullName} {text}
          </ListboxItem>
        );
      }}
    </Listbox>
  );
}
