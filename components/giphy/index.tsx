"use client";
import React from "react";
import GiphyGrid from "./grid";
import { useBodyOverflowHidden } from "@/hooks/use-body-overflow-hidden";
import {
  useGiphyGridActions,
  useGiphyGridIsOpen,
} from "@/stores/giphy-grid-store";
import ModalLayoutV2 from "../modal/layoutV2";

export default function Giphy() {
  const isOpen = useGiphyGridIsOpen();
  const { onClose } = useGiphyGridActions();

  useBodyOverflowHidden(isOpen);

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      classNames={{ wrapper: "z-[102]", body: "px-0 relative py-0" }}
    >
      <GiphyGrid />
    </ModalLayoutV2>
  );
}

{
  /* <Card
      radius="none"
      className="w-full h-[80%] fixed inset-x-0 bottom-0 z-[102]"
    >
      <div className="w-full p-1 bg-inherit flex justify-start">
        <Button isIconOnly radius="full" variant="light" onClick={onClose}>
          <BiChevronDown size={25} />
        </Button>
      </div>
      <CardBody className="p-0 w-full hide-scrollbar">
        <GiphyGrid />
      </CardBody>
    </Card> */
}
