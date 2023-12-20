"use client";
import React from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import { formatBytes } from "@/lib/formatBytes";
import { MAX_FILE_SIZE } from "@/lib/zod-schema/image";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Chip } from "@nextui-org/chip";
import Image from "next/image";

export default function ImageChip({
  image,
  onClose,
}: {
  image: File;
  onClose: (image: File) => null | undefined;
}) {
  return (
    <Popover classNames={{ base: "rounded-md h-auto" }}>
      <PopoverTrigger>
        <Chip
          color={image.size > MAX_FILE_SIZE ? "danger" : "default"}
          onClose={() => onClose(image)}
        >
          {image.name?.length > 10 ? image.name.slice(0, 10) : image.name}{" "}
          {image.name.length > 10 && "..."}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-[90%] sm:max-w-[350px]">
        <div className="p-1 flex flex-col gap-2">
          <TypographyLarge className="font-semibold text-sm">
            {image.name}
          </TypographyLarge>
          <Image
            src={URL.createObjectURL(image)}
            alt={image.name}
            width={95}
            height={95}
            quality={35}
            className="w-auto h-auto max-w-[120px] rounded-sm"
          />
          <table className="w-fit border-separate border-spacing-1">
            <tbody>
              <tr>
                <td>
                  <TypographyMuted className="text-xs font-semibold">
                    Size:
                  </TypographyMuted>
                </td>
              </tr>
              <tr>
                <td>
                  <TypographyMuted className="text-xs">
                    {image.size} bytes,
                  </TypographyMuted>
                </td>
              </tr>
              <tr>
                <td>
                  <TypographyMuted className="text-xs">
                    {formatBytes(image.size, "kb")} Kb,
                  </TypographyMuted>
                </td>
              </tr>
              <tr>
                <td>
                  <TypographyMuted className="text-xs">
                    {formatBytes(image.size, "mb")} Mb
                  </TypographyMuted>
                </td>
              </tr>
            </tbody>
          </table>

          {image.size > MAX_FILE_SIZE && (
            <TypographyMuted className="text-danger">
              File size is too large, max file size is{" "}
              {formatBytes(MAX_FILE_SIZE, "kb")}kb
            </TypographyMuted>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
