"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { BsCardImage } from "react-icons/bs";
import { Controller, Control } from "react-hook-form";
import { AiOutlineGif } from "react-icons/ai";

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
        <Button isIconOnly className="text-[18px]">
          <FiMoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0" onClick={() => setIsOpen(false)}>
        <Listbox variant="light">
          <ListboxItem key="image">
            <Button
              isIconOnly
              className="relative rounded-lg"
              isDisabled={isGifMenuOpen}
            >
              <BsCardImage size={18} />
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <input
                    disabled={isGifMenuOpen}
                    multiple={false}
                    onChange={(e) => {
                      setIsOpen(false);
                      onChange(e.target?.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                    className="absolute opacity-0 inset-0"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/webp"
                  />
                )}
              />
            </Button>
          </ListboxItem>
          <ListboxItem key="gif-menu">
            <Button
              isIconOnly
              className="relative rounded-lg"
              onClick={onGifMenuOpen}
            >
              <AiOutlineGif size={18} />
            </Button>
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
