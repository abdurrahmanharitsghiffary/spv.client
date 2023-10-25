"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useRouter } from "next/navigation";
import React from "react";
import { BiChevronLeft } from "react-icons/bi";

export default function TopBar() {
  const router = useRouter();

  return (
    <>
      <Card className="shadow-none">
        <CardBody className=" p-2">
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onClick={() => router.back()}
          >
            <BiChevronLeft size={25} />
          </Button>
        </CardBody>
      </Card>
      <Divider />
    </>
  );
}
