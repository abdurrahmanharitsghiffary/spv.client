"use client";
import React from "react";
import GiphyGrid from "./grid";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { BiChevronDown } from "react-icons/bi";
import { useGifMenuControls } from "@/hooks/use-gif-menu";
import { useBodyOverflowHidden } from "@/hooks/use-body-overflow-hidden";

export default function Giphy() {
  const controls = useGifMenuControls();

  useBodyOverflowHidden(controls.isOpen);

  if (!controls.isOpen) return null;

  return (
    <Card
      radius="none"
      className="w-full h-[80%] fixed inset-x-0 bottom-0 z-[102]"
    >
      <div className="w-full p-1 bg-inherit flex justify-start">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onClick={controls.onClose}
        >
          <BiChevronDown size={25} />
        </Button>
      </div>
      <CardBody className="p-0 w-full hide-scrollbar">
        <GiphyGrid />
      </CardBody>
    </Card>
  );
}
