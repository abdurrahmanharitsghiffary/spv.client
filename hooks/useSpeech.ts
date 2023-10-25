"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useSpeech() {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<null | SpeechRecognitionErrorCode>(null);
  const [boolStatus, setBoolStatus] = useState<{
    isSpeechStart: boolean;
    isStart: boolean;
    isInactive: boolean;
    isAudioStart: boolean;
  }>({
    isAudioStart: false,
    isSpeechStart: false,
    isStart: false,
    isInactive: true,
  });
  const [status, setStatus] = useState<"start" | "inactive" | "speechstart">(
    "inactive"
  );

  const isAudioStart = useMemo(
    () => boolStatus.isAudioStart,
    [boolStatus.isAudioStart]
  );
  const isSpeechStart = useMemo(
    () => boolStatus.isSpeechStart,
    [boolStatus.isSpeechStart]
  );
  const isStart = useMemo(() => boolStatus.isStart, [boolStatus.isStart]);
  const isInactive = useMemo(
    () => boolStatus.isInactive,
    [boolStatus.isInactive]
  );

  const onAudioStart = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isAudioStart: true }));
  }, []);

  const onAudioEnd = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isAudioStart: false }));
  }, []);

  const onSpeechStart = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isSpeechStart: true }));
  }, []);

  const onSpeechEnd = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isSpeechStart: false }));
  }, []);

  const onInactive = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isInactive: true }));
  }, []);

  const onActive = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isInactive: false }));
  }, []);

  const onStart = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isStart: true }));
  }, []);

  const onEnd = useCallback(() => {
    setBoolStatus((c) => ({ ...c, isStart: false }));
  }, []);

  const onRecognitionStart = useCallback(() => {
    onStart();
    onActive();
    setErrors(null);
    setResult(null);
  }, [onActive, onStart]);

  const onRecognitionEnd = useCallback(() => {
    onEnd();
    onInactive();
    onSpeechEnd();
  }, [onEnd, onInactive, onSpeechEnd]);

  useEffect(() => {
    // let speech: SpeechRecognition | undefined;
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) &&
      !recognition
    ) {
      const { webkitSpeechRecognition, SpeechRecognition } = window;
      const recognition: SpeechRecognition =
        new webkitSpeechRecognition() || new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-US";
      recognition.onstart = () => {
        onRecognitionStart();
        setStatus("start");
      };

      recognition.onaudiostart = () => onAudioStart();
      recognition.onaudioend = () => onAudioEnd();

      recognition.onspeechstart = () => {
        onSpeechStart();
        setStatus("speechstart");
      };

      recognition.onspeechend = () => {
        onSpeechEnd();
        setStatus("start");
      };

      recognition.onend = () => {
        onRecognitionEnd();
        setStatus("inactive");
      };

      recognition.onerror = (e) => {
        onRecognitionEnd();
        if (e?.error) setErrors(e.error);
        setStatus("inactive");
      };

      recognition.onresult = (e) => {
        const resultString: string[] = [];
        Array.from(e.results)?.forEach((result) => {
          resultString.push(result?.[0].transcript ?? "");
        });
        setResult(resultString.join(""));
      };
      // speech = recognition;
      if (recognition) setRecognition(recognition);
    }

    // return () => {
    //   if (speech && typeof window !== "undefined") {
    //     speech.abort();
    //     setRecognition(null);
    //   }
    // };
  }, [recognition]);

  return {
    recognition,
    result,
    status,
    isAudioStart,
    isInactive,
    isSpeechStart,
    isStart,
    errors,
  };
}
