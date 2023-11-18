"use client";
import React, { useCallback, useState } from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Image from "next/image";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { MAX_FILE_SIZE } from "@/lib/zod-schema/image";
import { formatBytes } from "@/lib/formatBytes";
import clsx from "clsx";

export default function CreatePostImageChip({
  images,
  onCloseClick,
  className,
  wrapperClassName,
}: {
  images: FileList | File[] | null;
  onCloseClick?: (
    name: "images",
    value: any,
    options?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
          shouldTouch: boolean;
        }>
      | undefined
  ) => void;
  className?: string;
  wrapperClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(
    (image: File) => {
      if (!onCloseClick || !images) return null;

      const files = Array.from(images).filter(
        (img) =>
          !`${img.name}${img.size}${image.type}`.includes(
            `${image.name}${image.size}${image.type}`
          )
      );
      if (files instanceof Array && !(files instanceof FileList)) {
        onCloseClick("images", [...files]);
      } else if (files instanceof FileList) {
        const fileList = new DataTransfer();

        for (let file of files) {
          fileList.items.add(file);
        }

        onCloseClick("images", fileList.files);
      }
    },
    [images, onCloseClick]
  );

  if (!images || (images?.length ?? 0) === 0) return null;

  return (
    <div
      className={clsx(
        "overflow-x-auto hide-scrollbar w-full",
        wrapperClassName
      )}
    >
      <div
        className={clsx("w-full max-w-full flex gap-2 flex-nowrap", className)}
      >
        {Array.from(images ?? []).map((image) => (
          <Tooltip
            isOpen={isOpen}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            classNames={{ base: "rounded-md h-auto" }}
            key={image.name}
            content={
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
            }
          >
            <Chip
              // className="w-[40%]"
              color={image.size > MAX_FILE_SIZE ? "danger" : "default"}
              onClose={() => handleClose(image)}
            >
              {image.name?.length > 10 ? image.name.slice(0, 10) : image.name}{" "}
              {image.name.length > 10 && "..."}
            </Chip>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
