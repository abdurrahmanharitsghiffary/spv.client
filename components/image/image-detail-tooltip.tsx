import { Tooltip } from "@nextui-org/tooltip";
import React, { ReactNode } from "react";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import Image from "next/image";
import { MAX_FILE_SIZE } from "@/lib/createPostSchema";

export default function ImageDetailTooltip({
  children,
  image,
}: {
  image: File;
  children?: ReactNode;
}) {
  return (
    <Tooltip
      classNames={{ base: "rounded-md h-auto fixed" }}
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
                  {(image.size / 1000).toFixed(2)} Kb,
                </TypographyMuted>
              </td>
            </tr>
            <tr>
              <td>
                <TypographyMuted className="text-xs">
                  {(image.size / 1000000).toFixed(2)} Mb
                </TypographyMuted>
              </td>
            </tr>
          </table>

          {image.size > MAX_FILE_SIZE && (
            <TypographyMuted className="text-danger">
              File size is too large, max file size is{" "}
              {(MAX_FILE_SIZE / 1000000).toFixed(2)}Mb
            </TypographyMuted>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}
