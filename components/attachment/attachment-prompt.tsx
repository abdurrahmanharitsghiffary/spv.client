"use client";
import React from "react";
import IconButton from "../button/icon-button";
import { FiX } from "react-icons/fi";
import { FcAudioFile, FcDocument, FcVideoFile } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ButtonProps } from "@nextui-org/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  classNames?: {
    itemButton?: string;
    itemTitle?: string;
    itemWrapper?: string;
    body?: string;
  };
};

type Item = {
  label: string;
  icon: React.ReactNode;
  color: ButtonProps["color"];
};

const items: Item[] = [
  { label: "Document", icon: <FiX size={16} />, color: "primary" },
  { label: "Audio", icon: <FcAudioFile />, color: "warning" },
  { label: "Video", icon: <FcVideoFile />, color: "secondary" },
];

export default function AttachmentPrompt({
  isOpen,
  onClose,
  className,
  classNames,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, bottom: -100 }}
          animate={{ opacity: 1, bottom: 0 }}
          exit={{ opacity: 0, bottom: -100 }}
          className={clsx(
            "fixed bottom-0 inset-x-0 bg-content1 z-[9999] py-4 pt-8 px-2",
            className
          )}
        >
          <IconButton
            size="sm"
            className="absolute top-0 left-0"
            onClick={onClose}
          >
            <FiX size={16} />
          </IconButton>
          <div
            className={clsx("grid grid-cols-3 gap-2 w-full", classNames?.body)}
          >
            {items.map((v) => (
              <div
                className={clsx(
                  "flex flex-col gap-1 items-center",
                  classNames?.itemWrapper
                )}
                key={v.label}
              >
                <IconButton
                  variant="solid"
                  size="lg"
                  color={v.color}
                  className={classNames?.itemButton}
                >
                  {v.icon}
                </IconButton>
                <p className={clsx("text-tiny", classNames?.itemTitle)}>
                  {v.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
