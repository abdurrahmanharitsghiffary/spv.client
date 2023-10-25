import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

export default function CommentSkeleton({
  level = 0,
  className,
}: {
  level?: number;
  className?: string;
}) {
  const style = `${
    level > 0 ? "border-l" : ""
  } rounded-none dark:border-[#FFFFFF26] border-[rgba(18, 18, 18, 0.15)] shadow-none pl-4 ml-5 w-full ${
    className ?? ""
  }`;

  return (
    <div className="flex gap-2 relative w-full">
      <Avatar className="absolute" />
      {level > 1 && (
        <span className="absolute top-[20px] w-[10%] h-[1px] bg-divider -left-[20px]"></span>
      )}

      <Card className={style}>
        <CardHeader className="pb-0 pt-0 flex justify-start w-[50%] mt-2">
          <div className="flex flex-col w-full gap-2">
            <Skeleton className="h-2 w-[40%] rounded-medium max-w-full min-w-[45px]" />
            <Skeleton className="h-2 w-[35%] rounded-medium min-w-[35px]" />
          </div>
          <div className="flex gap-2 items-start justify-end">
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
        </CardHeader>
        <CardBody className="text-sm p-0 my-3 w-full flex flex-col gap-2 ml-[0.8rem] shadow-[0_0_7px_-1px_rgba(0,0,0,0)]">
          {[1, 2, 3].map((item) => (
            <Skeleton
              className="h-2 w-[20%] rounded-medium max-w-full min-w-[50px]"
              key={item}
            />
          ))}
        </CardBody>
        <CardFooter className="gap-3 pt-1">
          <span className="text-xs text-foreground">Reply</span>
        </CardFooter>
        {/* {isShow &&
      commentIds?.length > 0 &&
      commentIds.map((id) => (
        <CommentReply level={level + 1} key={id} commentId={id} />
      ))} */}
      </Card>
    </div>
  );
}
