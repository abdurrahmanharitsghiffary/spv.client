import { Card, CardBody, CardProps } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import clsx from "clsx";
import React from "react";

export default function UserCardSkeleton({
  className,
  as,
}: {
  className?: string;
  as?: CardProps["as"];
}) {
  const cl = clsx("w-full dark:bg-inherit h-[68px]", className);
  return (
    <Card className={cl} as={as}>
      <CardBody className="flex flex-col gap-4 relative p-4 max-w-full h-full py-3">
        <div className="flex gap-4 justify-between items-center w-full h-full">
          <div className="flex gap-4 items-center w-[70%] h-full">
            <div className="w-[25%] h-fit flex justify-start items-center">
              <Skeleton className="rounded-full h-[40px] w-[40px] aspect-square" />
            </div>

            <div className="flex flex-col gap-1 truncate w-[75%]">
              <Skeleton className="h-2 w-[50%] rounded-medium"></Skeleton>
              <Skeleton className="h-2 w-[40%] rounded-medium"></Skeleton>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
