"use client";
import { useEffect, useState } from "react";
import useSpeech from "./use-speech";

export default function useRecorder() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [status, setStatus] = useState<"inactive" | "paused" | "recording">(
    "inactive"
  );
  const [data, setData] = useState<Blob | null>(null);

  useEffect(() => {
    if (navigator.mediaDevices) {
      setIsSupported(true);
    }

    if (isSupported) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.onstart = () => setStatus(mediaRecorder.state);
        mediaRecorder.onpause = () => setStatus(mediaRecorder.state);
        mediaRecorder.onresume = () => setStatus(mediaRecorder.state);
        mediaRecorder.onstop = () => setStatus(mediaRecorder.state);
        mediaRecorder.onerror = (e) => {
          setStatus(mediaRecorder.state);
        };
        mediaRecorder.ondataavailable = (blob) => setData(blob.data);
        setRecorder(mediaRecorder);
      });
    }
  }, [isSupported, setRecorder]);

  return { recorder, status, isSupported, data };
}
