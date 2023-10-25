import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
} from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Divider } from "@nextui-org/divider";
import React from "react";
import { User } from "@nextui-org/user";
import { Button, ButtonGroup } from "@nextui-org/button";
import { FiMoreVertical, FiThumbsUp } from "react-icons/fi";
import { BiComment } from "react-icons/bi";
import { PiPaperPlaneTilt } from "react-icons/pi";

export default function PostCardSkeleton(props: CardProps) {
  const style = `${
    props.className ?? ""
  } rounded-none w-full dark:border-t-0 border-b-1 last:border-b-0 dark:border-b-0 border-divider shadow-none`;

  return (
    <Card className={style} {...props} shadow="none" radius="none">
      <CardHeader className="flex justify-between w-full">
        <div className="flex gap-2 items-center w-full">
          <User name="" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="rounded-medium h-2 w-[20%]" />
            <Skeleton className="rounded-medium h-2 w-[15%]" />
          </div>
        </div>

        <Button isIconOnly variant="light" radius="full">
          <FiMoreVertical />
        </Button>
      </CardHeader>
      <CardBody className="gap-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-[60%] rounded-medium"></Skeleton>
          <Skeleton className="h-3 w-[60%] rounded-medium"></Skeleton>
          <Skeleton className="h-3 w-[60%] rounded-medium"></Skeleton>
          <Skeleton className="h-3 w-[60%] rounded-medium"></Skeleton>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="py-2">
        <ButtonGroup fullWidth variant="light">
          <Button>
            <FiThumbsUp /> 0
          </Button>
          <Button>
            <BiComment /> 0
          </Button>
          <Button>
            <PiPaperPlaneTilt />
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
