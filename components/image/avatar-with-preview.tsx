"use client";
import { useShowPreviewImage } from "@/hooks/use-preview-image";
import { Avatar, AvatarProps } from "@nextui-org/avatar";
import React from "react";

export default function AvatarWithPreview(props: AvatarProps) {
  const showPreview = useShowPreviewImage();

  return <Avatar {...props} onClick={() => showPreview(props.src ?? "")} />;
}
