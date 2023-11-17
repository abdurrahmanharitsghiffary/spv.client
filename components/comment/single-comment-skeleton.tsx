import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

export default function SingleCommentSkeleton() {
  return (
    <div className="w-full flex flex-col p-4 justify-center items-start relative">
      <div className="w-full flex gap-2 items-center">
        <Avatar />
        <div className="flex w-[60%] flex-col gap-2 justify-center">
          <Skeleton className="w-[30%] h-2 rounded-medium" />
          <Skeleton className="w-[20%] h-2 rounded-medium" />
        </div>
      </div>
      <div className="flex gap-2 justify-between items-center absolute top-0 right-4">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="w-unit-6 h-unit-6 min-w-unit-6"
        >
          <AiOutlineHeart size={16} color="#F31260" />
        </Button>
        <Button
          isIconOnly
          radius="full"
          variant="light"
          size="sm"
          className="w-unit-6 h-unit-6 min-w-unit-6"
        >
          <FiMoreVertical size={16} />
        </Button>
      </div>
    </div>
  );
}
