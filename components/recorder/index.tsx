"use client";
import useSpeech from "@/hooks/useSpeech";
import { Button, ButtonProps } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import React, { useCallback, useEffect } from "react";
import { BsMicFill, BsMicMuteFill, BsStopFill } from "react-icons/bs";

function Recorder({
  className,
  onSpeechSuccess,
  ...props
}: {
  className?: string;
  onSpeechSuccess?: (result?: string | null) => void;
} & ButtonProps) {
  const { recognition, result, status, isSpeechStart, errors } = useSpeech();
  const handleSuccesSpeech = useCallback(
    (result: string | null | undefined) => {
      if (onSpeechSuccess) onSpeechSuccess(result);
    },
    []
  );

  useEffect(() => {
    if (result) handleSuccesSpeech(result);
  }, [result, handleSuccesSpeech]);

  return (
    <>
      <Tooltip content={"Say something..."}>
        {status === "inactive" ? (
          <Button
            isIconOnly
            radius="full"
            {...props}
            onClick={() => recognition?.start()}
            className={className}
          >
            {errors === "not-allowed" ? <BsMicMuteFill /> : <BsMicFill />}
          </Button>
        ) : (
          <Button
            isIconOnly
            radius="full"
            {...props}
            onClick={() => recognition?.stop()}
            className={className}
          >
            <BsStopFill />
          </Button>
        )}
      </Tooltip>
      {/* 
      {isSpeechStart && <p>Listening...</p>}
      {result && <p>{result}</p>}
      {errors === "not-allowed" ? (
        <p>Microphone permission denied</p>
      ) : (
        <p>{errors}</p>
      )} */}
    </>
  );
}

export default React.memo(Recorder);
