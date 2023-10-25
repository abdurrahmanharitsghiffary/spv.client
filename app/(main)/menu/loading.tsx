import { Avatar } from "@nextui-org/avatar";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";

export default function MenuLoading() {
  return (
    <div className="w-full mx-auto flex gap-2 items-center px-2 z-[1] p-1 group hover:backdrop-brightness-75 dark:hover:bg-default-200 transition-all sticky top-[64px] bg-background border-b-1 border-divider py-2">
      <div className="w-fit">
        <Avatar className="dark:group-hover:bg-default-300 dark:transition-all" />
      </div>
      <div className="flex flex-col gap-2 w-[70%]">
        <Skeleton className="w-[80px] rounded-medium max-w-full h-3" />
        <Skeleton className="w-[65px] rounded-medium max-w-full h-3" />
      </div>
    </div>
  );
}
