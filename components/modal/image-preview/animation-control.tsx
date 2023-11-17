"use client";
import { downloadImage } from "@/lib/downloadImage";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import React from "react";
import {
  BiDownload,
  BiRotateLeft,
  BiRotateRight,
  BiZoomIn,
  BiZoomOut,
} from "react-icons/bi";

export default function AnimationControl({
  src,
  setAnimation,
}: {
  src?: string;
  setAnimation: React.Dispatch<
    React.SetStateAction<{
      scale: number;
      rotate: number;
    }>
  >;
}) {
  const ref = React.useRef(null);
  return (
    <Card className="flex-row" ref={ref}>
      <Button
        isIconOnly
        variant="light"
        size="lg"
        radius="full"
        onClick={() =>
          setAnimation((c) => ({
            ...c,
            scale: c.scale + 0.25 > 1.5 ? 1.5 : c.scale + 0.25,
          }))
        }
      >
        <BiZoomIn size={20} />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="lg"
        radius="full"
        onClick={() =>
          setAnimation((c) => ({ ...c, scale: c.scale - 0.25 || 0.25 }))
        }
      >
        <BiZoomOut size={20} />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="lg"
        radius="full"
        onClick={() => setAnimation((c) => ({ ...c, rotate: c.rotate + 90 }))}
      >
        <BiRotateRight size={20} />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="lg"
        radius="full"
        onClick={() => setAnimation((c) => ({ ...c, rotate: c.rotate - 90 }))}
      >
        <BiRotateLeft size={20} />
      </Button>
      <Button
        isIconOnly
        variant="light"
        size="lg"
        radius="full"
        onClick={() => downloadImage(src ?? "")}
      >
        <BiDownload size={20} />
      </Button>
    </Card>
  );
}
