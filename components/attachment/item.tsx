"use client";
import { MimeType } from "@/types/mime";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { TypographyMuted } from "../ui/typography";
import {
  FcAudioFile,
  FcDocument,
  FcFile,
  FcImageFile,
  FcVideoFile,
} from "react-icons/fc";
import { formatBytes } from "@/lib/formatBytes";
import { downloadFile } from "@/lib/downloadFile";

type Props = {
  file: File;
};

export default function AttachmentItem({ file }: Props) {
  console.log(file.type, "Type");
  const getIcon = (type: MimeType) => {
    if (type.includes("application") || type.includes("text")) {
      return <FcDocument />;
    } else if (type.includes("video")) {
      return <FcVideoFile />;
    } else if (type.includes("audio")) {
      return <FcAudioFile />;
    } else if (type.includes("image")) {
      return <FcImageFile />;
    }
    return <FcFile />;
  };

  const icon = getIcon(file?.type as any);

  const handleDownloadFile = async () => {
    downloadFile(URL.createObjectURL(file));
  };

  return (
    <Card
      className="w-fit hover:bg-content2 cursor-pointer"
      title={`${file.name}`}
    >
      <CardBody>
        <div
          className="flex gap-2 items-center max-w-[150px] truncate"
          onClick={handleDownloadFile}
        >
          <div className="flex flex-col gap-1 max-w-[70%]">
            <TypographyMuted className="truncate">{file.name}</TypographyMuted>
            <TypographyMuted className="!text-xs truncate !text-foreground-500">
              {formatBytes(file.size, file.size > 1000000 ? "mb" : "kb")}
              {file.size > 1000000 ? "mb" : "kb"} •{" "}
              {file.name.split(".").slice(-1)[0].toUpperCase()}
            </TypographyMuted>
          </div>

          <div className="text-[35px] flex flex-auto justify-center items-center">
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
