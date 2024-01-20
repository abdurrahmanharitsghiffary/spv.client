"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const useAudio = (src: string) => {
  const [isPlayable, setIsPlayable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  console.log(isPlayable, "IsPlayable");

  console.log(audioRef, "audioRef");
  const handlePlay = useCallback(() => {
    const element = audioRef.current;
    if (element) {
      element.play();
    }
  }, [audioRef]);

  const handlePause = useCallback(() => {
    const element = audioRef.current;
    if (element) {
      element.pause();
    }
  }, [audioRef]);

  const onCanPlaythrough = useCallback(() => {
    setIsPlayable(true);
  }, []);

  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onTimeUpdate = useCallback(
    (e: Event) => {
      console.log(audioRef.current?.currentTime, "currentTime");
      setProgressTime(audioRef.current?.currentTime ?? 0);
    },
    [audioRef]
  );

  const handleCurrentTimeUpdate = (num: number) => {
    if (audioRef.current?.currentTime) audioRef.current.currentTime = num;
  };

  useEffect(() => {
    const audioElement = new Audio(src);
    audioRef.current = audioElement;
    const audio = audioRef?.current;
    if (!audio) return;

    console.log(audio, "New Audio");
    console.log(audio.currentTime, "currentTime");
    console.log(audio.readyState, "hv en data");
    audio.addEventListener("canplaythrough", onCanPlaythrough);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlaythrough);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [src, onCanPlaythrough, onEnded, onPlay, onPause, onTimeUpdate]);

  return {
    isPlayable,
    isPlaying,
    handlePlay,
    handlePause,
    progressTime,
    audioRef,
    handleCurrentTimeUpdate,
  };
};
