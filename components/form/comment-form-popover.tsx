"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import React, { useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { BsCardImage } from "react-icons/bs";
import { Controller, Control } from "react-hook-form";
import { AiOutlineGif } from "react-icons/ai";
import { useGiphyGridActions } from "@/stores/giphy-grid-store";
import InputFile from "../input/file";

export default function CommentFormPopover({
  control,
}: {
  control: Control<
    {
      comment: string;
      image?: any;
    },
    any
  >;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onClose = () => setIsOpen(false);
  const { onOpen: showGifMenu } = useGiphyGridActions();

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        showArrow
        shouldBlockScroll
        placement="top"
        classNames={{ base: "px-0" }}
        containerPadding={0}
      >
        <PopoverTrigger>
          <Button isIconOnly className="text-[1.125rem]">
            <FiMoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0">
          <Listbox
            itemClasses={{ title: "text-[0.75rem]" }}
            variant="light"
            onAction={(key) => {
              try {
                switch (key) {
                  case "image": {
                    inputRef.current?.click();
                    return null;
                  }
                  case "gif-menu": {
                    showGifMenu();
                    return null;
                  }
                }
              } catch (err) {
              } finally {
                onClose();
              }
            }}
          >
            <ListboxItem key="image" startContent={<BsCardImage size={14} />}>
              Upload image
            </ListboxItem>
            <ListboxItem
              key="gif-menu"
              startContent={<AiOutlineGif size={14} />}
            >
              Upload Gif
            </ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      <Controller
        control={control}
        name="image"
        render={({ field: { onChange, ref } }) => (
          <InputFile
            ref={(node) => {
              ref(node);
              inputRef.current = node;
            }}
            onChange={(e) => {
              onChange(e.target?.files?.[0] ?? null);
              e.target.value = "";
            }}
            className="absolute opacity-0 hidden"
          />
        )}
      />
    </>
  );
}
