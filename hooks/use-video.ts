"use client";

import { RefObject, useCallback, useEffect, useState } from "react";

export const useVideo = (videoRef: RefObject<HTMLVideoElement | null>) => {
  const [isPlayable, setIsPlayable] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<MediaError | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVol] = useState(0);
  const duration = videoRef.current?.duration ?? 0;
  const playbackRate = videoRef.current?.playbackRate ?? 0;

  const setPlaybackRate = (playbackRate: number) => {
    if (videoRef.current?.playbackRate !== undefined)
      videoRef.current.playbackRate = playbackRate;
  };

  const setCurrentTime = useCallback(
    (currTime: number) => {
      if (videoRef.current?.currentTime !== undefined) {
        videoRef.current.pause();
        videoRef.current.currentTime = currTime;
      }
    },
    [videoRef]
  );

  const setVolume = (volume: number) => {
    if (videoRef.current?.volume !== undefined)
      videoRef.current.volume = volume;
    setVol(videoRef.current?.volume ?? 0);
  };

  const showFullscreen = async () => {
    const element = videoRef.current;

    if (element) {
      await element.requestFullscreen({ navigationUI: "show" });
    }
  };

  const hideFullscreen = async () => {
    const element = videoRef.current;

    if (element) {
      await element.requestFullscreen({ navigationUI: "hide" });
    }
  };

  const toggleMute = () => {
    if (videoRef.current?.muted !== undefined)
      videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current?.muted ?? false);
  };

  const togglePlay = () => {
    const element = videoRef.current;
    if (element) {
      if (element?.paused) {
        element.play();
      } else {
        element.pause();
      }
    }
  };

  const reset = useCallback(() => {
    setIsPlaying(false);
    // setProgressTime(0);
    setError(null);
    setIsError(false);
  }, []);

  const onCanPlayThrough = useCallback(() => {
    setIsPlayable(true);
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(videoRef.current?.paused ? false : true);
  }, [videoRef]);

  const onPause = useCallback(() => {
    setIsPlaying(videoRef?.current?.paused ? false : true);
  }, [videoRef]);

  const onEnded = useCallback(() => {
    reset();
  }, [reset]);

  const onError = useCallback(() => {
    setIsError(true);
    setError(videoRef.current?.error ?? null);
  }, [videoRef]);

  const onTimeUpdate = useCallback(() => {
    setProgressTime(videoRef.current?.currentTime ?? 0);
  }, [videoRef]);

  const onVolumeChange = useCallback(() => {
    setIsMuted(videoRef.current?.muted ?? false);
    setVol(videoRef.current?.volume ?? 0);
  }, [videoRef]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    setIsMuted(videoElement.muted);
    videoElement.addEventListener("canplaythrough", onCanPlayThrough);
    videoElement.addEventListener("play", onPlay);
    videoElement.addEventListener("pause", onPause);
    videoElement.addEventListener("ended", onEnded);
    videoElement.addEventListener("error", onError);
    videoElement.addEventListener("timeupdate", onTimeUpdate);
    videoElement.addEventListener("volumechange", onVolumeChange);

    return () => {
      videoElement.removeEventListener("canplaythrough", onCanPlayThrough);
      videoElement.removeEventListener("play", onPlay);
      videoElement.removeEventListener("pause", onPause);
      videoElement.removeEventListener("ended", onEnded);
      videoElement.removeEventListener("error", onError);
      videoElement.removeEventListener("timeupdate", onTimeUpdate);
      videoElement.removeEventListener("volumechange", onVolumeChange);
    };
  }, [
    videoRef,
    onCanPlayThrough,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
    onVolumeChange,
  ]);

  return {
    isPlayable,
    isPlaying,
    setVolume,
    hideFullscreen,
    playbackRate,
    showFullscreen,
    error,
    isError,
    duration,
    volume,
    isMuted,
    progressTime,
    toggleMute,
    togglePlay,
    setPlaybackRate,
    setCurrentTime,
  };
};
