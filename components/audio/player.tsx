"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import React from "react";
import IconButton from "../button/icon-button";
import { MdAudiotrack, MdPause, MdPlayArrow } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { useAudio } from "@/hooks/use-audio";
import { Progress } from "@nextui-org/progress";
import { ButtonProps } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { downloadFile } from "@/lib/downloadFile";
import { getMediaDuration } from "@/lib/get-media-duration";

export default function AudioPlayer({
  src,
  color,
}: {
  src: string;
  color?: ButtonProps["color"];
}) {
  const {
    isPlaying,
    handlePause,
    isPlayable,
    handlePlay,
    progressTime,
    audioRef,
    handleCurrentTimeUpdate,
  } = useAudio(src);

  const duration = audioRef?.current?.duration ?? 0;

  const handlePlayback = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleDownloadFile = () => {
    downloadFile(src);
  };

  return (
    <Card
      className="max-w-[200px] border-content1-foreground/20 border-1"
      shadow="none"
    >
      <CardBody>
        <div className="w-full items-center flex gap-3 pr-2">
          <IconButton
            variant="faded"
            color={color ?? "warning"}
            onClick={handlePlayback}
            size="sm"
          >
            {isPlaying ? <MdPause size={16} /> : <MdPlayArrow size={16} />}
          </IconButton>
          <div className="max-w-full h-fit flex-1 relative">
            <input
              type="range"
              className="w-full absolute top-[-6px] cursor-pointer z-10 opacity-0"
              value={(progressTime / duration) * 100}
              onChange={(e) => {
                handlePause();
                const curT = (Number(e.target.value) / 100) * duration;
                handleCurrentTimeUpdate(curT);
              }}
            />
            <Progress
              disableAnimation
              color={color ?? "warning"}
              size="sm"
              className="h-2"
              value={(progressTime / duration) * 100}
            />
            <div className="absolute inset-x-0 -bottom-4 flex justify-between text-xs text-foreground-500">
              <span>{getMediaDuration(progressTime)}</span>
              <span>{getMediaDuration(duration)}</span>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0 flex gap-2 items-center w-full">
        {isPlayable ? <MdAudiotrack /> : <Spinner size="sm" color="warning" />}
        <span className="text-xs flex-1 max-w-full text-foreground-500 truncate">
          {src.split("/").slice(-1)[0]}
        </span>
        <IconButton size="sm" onClick={handleDownloadFile}>
          <IoMdDownload size={16} />
        </IconButton>
      </CardFooter>
    </Card>
  );
}
