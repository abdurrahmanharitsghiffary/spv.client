"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import React, { useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { BsCardImage } from "react-icons/bs";
import { Controller, Control } from "react-hook-form";
import { AiOutlineGif } from "react-icons/ai";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/zod-schema/image";
import clsx from "clsx";

export default function CommentFormPopover({
  isGifMenuOpen,
  control,
  onGifMenuOpen,
}: {
  isGifMenuOpen?: boolean;
  control: Control<
    {
      comment: string;
      image?: any;
    },
    any
  >;
  onGifMenuOpen: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  return (
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
                  return null;
                }
                case "gif-menu": {
                  onGifMenuOpen();
                  return null;
                }
              }
            } catch (err) {
            } finally {
              onClose();
            }
          }}
        >
          <ListboxItem
            key="image"
            className={clsx(isGifMenuOpen && "brightness-90")}
            startContent={<BsCardImage size={14} />}
          >
            <Controller
              control={control}
              name="image"
              disabled={isGifMenuOpen}
              render={({ field: { onChange } }) => (
                <input
                  disabled={isGifMenuOpen}
                  multiple={false}
                  onChange={(e) => {
                    setIsOpen(false);
                    onChange(e.target?.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                  className="absolute opacity-0 inset-0 cursor-pointer"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                />
              )}
            />
            Upload image
          </ListboxItem>
          <ListboxItem key="gif-menu" startContent={<AiOutlineGif size={14} />}>
            Upload Gif
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
