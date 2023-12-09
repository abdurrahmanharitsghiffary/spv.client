import { Avatar } from "@nextui-org/avatar";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";

export default function GroupPageLoading() {
  return (
    <>
      <div className="w-32 h-32 rounded-full z-10 mx-auto">
        <Avatar
          color="default"
          isBordered
          src={""}
          showFallback
          className="object-cover text-default-800 dark:text-default-foreground min-h-[128px] max-h-[128px] rounded-full min-w-[128px] max-w-[128px] object-center"
        />
      </div>
      <div className="w-full flex flex-col gap-2 px-4">
        <Skeleton className="min-w-[120px] max-w-[200px] h-[30px]" />
        <Skeleton className="min-w-[70px] max-w-[120px] h-[30px]" />
        <div className="flex gap-2 justify-between w-full py-2">
          <Skeleton className="flex-1 h-[56px]" />
          <Skeleton className="flex-1 h-[56px]" />
        </div>
      </div>
    </>
  );
}
