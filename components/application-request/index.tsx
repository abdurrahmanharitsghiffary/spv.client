import { AppRequest as AppRT } from "@/types/app-request";
import { User } from "@nextui-org/user";
import React from "react";
import TextWithLimit from "../text-with-limit";
import Timestamp from "../timestamp";
import clsx from "clsx";
import AppRequestAction from "./action";

export default function AppRequest({
  appRequest,
  groupId,
}: {
  appRequest: AppRT | undefined;
  groupId: number;
}) {
  return (
    <div className="flex shadow-small rounded-small dark:border-1 dark:border-divider dark:shadow-none flex-col p-4 justify-start gap-2">
      <User
        className="justify-start"
        name={appRequest?.sender?.fullName}
        description={appRequest?.sender?.username}
        avatarProps={{
          src: appRequest?.sender?.avatarImage?.src,
          showFallback: true,
        }}
      />
      <div className="text-small md:text-base">
        Status:{" "}
        <span
          className={clsx(
            appRequest?.status === "PENDING"
              ? "bg-default text-default-foreground"
              : appRequest?.status === "APPROVED"
              ? "bg-success text-success-foreground"
              : "bg-danger text-danger-foreground",
            "p-2 py-[0.125rem] rounded-medium text-tiny"
          )}
        >
          {appRequest?.status}
        </span>
      </div>
      <TextWithLimit
        className="text-small md:text-base"
        text={appRequest?.comment ?? ""}
        maxLines={5}
      />
      <Timestamp
        date={appRequest?.createdAt}
        className="text-foreground-400 text-tiny"
      />
      <AppRequestAction appRequest={appRequest} groupId={groupId} />
    </div>
  );
}
