"use client";

import { useVideo } from "@/hooks/use-video";
import { Button, ButtonProps } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Slider } from "@nextui-org/slider";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { IoMdMore } from "react-icons/io";

import React, {
  MouseEventHandler,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  MdDownload,
  MdFullscreen,
  MdMore,
  MdPause,
  MdPlayArrow,
} from "react-icons/md";
import IconButton from "../button/icon-button";
import { getMediaDuration } from "@/lib/get-media-duration";
import { AnimatePresence, motion } from "framer-motion";
import { RiSpeedFill } from "react-icons/ri";
import { Select, SelectItem } from "@nextui-org/select";
import { FiCheck } from "react-icons/fi";

export default function VideoPlayer() {
  const [isShowControl, setIsShowControl] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const {
    duration,
    error,
    isError,
    isMuted,
    isPlayable,
    isPlaying,
    progressTime,
    toggleMute,
    togglePlay,
    setCurrentTime,
    setVolume,
    setPlaybackRate,
    showFullscreen,
    playbackRate,
    volume,
  } = useVideo(videoRef);

  console.log(duration, "Duration");
  console.log(isError, "Is Error");
  console.log(error, "Error");
  console.log(isMuted, "Is Muted");
  console.log(isPlayable, "Is Playable");
  console.log(isPlaying, "Is Playing");
  console.log(progressTime, "Progress Time");
  console.log(volume, "Volume");
  console.log(playbackRate, "Plb Rate");
  const handleCurrentTime = useCallback((v: number) => {
    setCurrentTime(v);
  }, []);

  const handleMouseEnter = () => {
    if (timeRef.current) clearTimeout(timeRef.current);
    setIsShowControl(true);
  };

  const handleMouseLeave = () => {
    timeRef.current = setTimeout(() => {
      setIsShowControl(false);
    }, 2000);
  };

  return (
    <Card
      className="w-fit"
      radius="none"
      isFooterBlurred
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        width={300}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        ref={videoRef}
        onClick={togglePlay}
      ></video>
      <CardFooter
        className="absolute bottom-0 p-0"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: isShowControl ? 1 : 0 }}
      >
        <PlayerControls
          duration={duration}
          progressValue={progressTime}
          isMuted={isMuted}
          isPlaying={isPlaying}
          onPlaybackChange={setPlaybackRate}
          onMute={toggleMute}
          onPlayPause={togglePlay}
          onSliderChange={handleCurrentTime}
          onFullscreen={async () => {
            await showFullscreen();
          }}
        />
      </CardFooter>
    </Card>
  );
}

const dropdownControlItems = [
  {
    key: "playback",
    label: "Playback speed",
    icon: <RiSpeedFill />,
  },
  {
    key: "download",
    label: "Download",
    icon: <MdDownload />,
  },
];

function PlayerControls({
  onFullscreen,
  onMute,
  onPlayPause,
  onSliderChange,
  duration,
  progressValue,
  isMuted,
  isPlaying,
  onMenuAction,
  onPlaybackChange,
  playbackRate,
}: {
  playbackRate?: number;
  onMenuAction?: (key: React.Key) => void;
  onPlayPause?: () => void;
  onSliderChange?: (v: number) => void;
  onMute?: () => void;
  onFullscreen?: () => void;
  isPlaying?: boolean;
  isMuted?: boolean;
  progressValue: number;
  duration: number;
  onPlaybackChange?: (v: number) => void;
}) {
  const [isShowThumb, setIsShowThumb] = useState(false);
  const handleSliderOnMouseEnter = () => {
    setIsShowThumb(true);
  };

  const handleSliderOnMouseLeave = () => {
    setIsShowThumb(false);
  };

  const handleDropdownAction = useCallback((key: React.Key) => {
    if (!onMenuAction) return;
    onMenuAction(key);
  }, []);

  const handlePlaybackChange = useCallback((playbackRate: number) => {
    if (!onPlaybackChange) return;
    onPlaybackChange(playbackRate);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full px-2 relative">
      <Slider
        onMouseEnter={handleSliderOnMouseEnter}
        onMouseLeave={handleSliderOnMouseLeave}
        hideThumb={isShowThumb === false}
        size="sm"
        color="foreground"
        value={(progressValue / duration) * 100}
        renderThumb={(props) => (
          <div
            {...props}
            className="group p-1 top-1/2 border-1 border-divider rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
          >
            <span className="transition-transform rounded-full w-3 h-3 block group-data-[dragging=true]:scale-80 bg-foreground" />
          </div>
        )}
        onChange={(v) => {
          if (!onSliderChange) return;
          const val = v instanceof Array ? v?.[0] ?? 0 : v;
          onSliderChange((val / 100) * duration);
        }}
      />
      <div className="flex gap-1 items-center justify-between pb-1">
        <div className="flex gap-1 items-center">
          <ControlButton onClick={onPlayPause}>
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </ControlButton>
          <ControlButton onClick={onMute}>
            {isMuted ? <GiSpeakerOff /> : <GiSpeaker />}
          </ControlButton>
          <span className="text-xs text-foreground">
            {getMediaDuration(progressValue)}/{getMediaDuration(duration)}
          </span>
        </div>

        <div className="flex gap-1 items-center">
          <Dropdown>
            <DropdownTrigger>
              <ControlButton>
                <IoMdMore />
              </ControlButton>
            </DropdownTrigger>
            <DropdownMenu
              closeOnSelect={false}
              items={dropdownControlItems}
              onAction={handleDropdownAction}
            >
              {(item) => (
                <DropdownItem
                  key={item.key}
                  startContent={item.icon}
                  closeOnSelect={item.key !== "playback"}
                  className="relative overflow-hidden"
                >
                  {item.key === "playback" ? (
                    <>
                      {item.label}
                      <PlaybackSelect
                        playbackRate={playbackRate}
                        onChange={(e) => {
                          handlePlaybackChange(Number(e.target.value));
                        }}
                      />
                    </>
                  ) : (
                    item.label
                  )}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <ControlButton onClick={onFullscreen}>
            <MdFullscreen />
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

const ControlButton = forwardRef<HTMLButtonElement, ButtonProps>(function (
  { children, ...rest },
  ref
) {
  return (
    <IconButton
      className="min-w-unit-6 min-h-unit-6 h-unit-6 w-unit-6"
      size="sm"
      {...rest}
      ref={ref}
    >
      {children}
    </IconButton>
  );
});

ControlButton.displayName = "ControlButton";

const dItems = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 10];

const playbackSpeedItems = dItems.map((item) => ({ key: item }));

function PlaybackSelect({
  onChange,
  playbackRate,
}: {
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  playbackRate?: number;
}) {
  return (
    <Select
      items={playbackSpeedItems}
      label="Playback speed"
      selectionMode="single"
      placeholder="Select playback speed"
      className="max-w-xs absolute inset-0 opacity-0"
      onChange={onChange}
    >
      {(item) => (
        <SelectItem
          value={item.key}
          key={item.key}
          endContent={item.key === playbackRate && <FiCheck />}
        >
          {item.key}
        </SelectItem>
      )}
    </Select>
  );
}
