import { NotificationType } from "@/types";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import Timestamp from "../timestamp";

const getContent = (type: NotificationType) => {
  switch (type) {
    case "comment": {
      return { user: "Juki", content: "commented on your post" };
    }
    case "follow": {
      return { user: "Joki", content: "started following you" };
    }
    case "liking_post": {
      return { user: "Jeki", content: "liked your recent post" };
    }
    case "liking_comment": {
      return { user: "Koki", content: "liked your comment" };
    }
    // case "post": {
    //   return { user: "Bokir", content: "created a new post" };
    // }
    case "replying_comment": {
      return { user: "Juki", content: "replied your comment on a post..." };
    }
    default: {
      return { user: "", content: "" };
    }
  }
};

export default function NotificationCard({
  type,
  isReaded,
}: {
  type: NotificationType;
  isReaded?: boolean;
}) {
  const text = getContent(type);

  return (
    <Card>
      <CardBody
        className={`gap-3 flex flex-row p-3 ${
          isReaded ? "dark:brightness-75 bg-default-200 dark:bg-content1" : ""
        }`}
      >
        <Avatar src="https://plus.unsplash.com/premium_photo-1695339147014-32f68336c10c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" />

        <div>
          <p>
            <strong>{text.user}</strong> {text.content}
          </p>
          <Timestamp date={new Date("2020")} />
        </div>
      </CardBody>
    </Card>
  );
}
