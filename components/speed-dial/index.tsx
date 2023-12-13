"use client";

import { Key } from "@/types";
import { Button } from "@nextui-org/button";
import { ButtonProps, Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import { Variants, motion, useCycle } from "framer-motion";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

type SpeedDialItem = {
  icon: React.JSX.Element;
  content?: string;
  color?: ButtonProps["color"];
  key: Key;
};

type SpeedDialProps = {
  shouldCloseAfterAction?: boolean;
  className?: string;
  items: SpeedDialItem[];
  onAction?: (key: Key) => void;
  buttonTriggerProps?: ButtonProps;
};

export default function SpeedDial({
  buttonTriggerProps = {},
  shouldCloseAfterAction = true,
  className,
  items = [],
  onAction = () => {},
}: SpeedDialProps) {
  const {
    size = "lg",
    as,
    isIconOnly = true,
    radius = "full",
    color = "primary",
    fullWidth = false,
    onClick,
    ...rest
  } = buttonTriggerProps;
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen, "isOpen");

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 20,
    },
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
  };

  const containerVariants: Variants = {
    hidden: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const iconVariants: Variants = {
    open: {
      rotate: 45,
    },
    close: {
      rotate: 0,
    },
  };

  return (
    <motion.div
      className={clsx("w-fit flex flex-col gap-2 items-center", className)}
      animate={isOpen ? "open" : "hidden"}
      // onMouseEnter={() => setIsOpen(true)}
      // onMouseLeave={() => setIsOpen(false)}
    >
      <motion.ul
        variants={containerVariants}
        className="flex flex-col gap-1 w-fit justify-center items-center"
        initial={false}
      >
        {items.map((item) => (
          <motion.li key={item.key} variants={itemVariants} initial={false}>
            <Tooltip content={item.content} placement="left">
              <Button
                isIconOnly
                radius="full"
                color={item.color ?? "default"}
                fullWidth={false}
                onClick={() => {
                  onAction(item.key);
                  if (shouldCloseAfterAction) {
                    setIsOpen(false);
                  }
                }}
              >
                <span className="text-[1.125rem]">{item.icon}</span>
              </Button>
            </Tooltip>
          </motion.li>
        ))}
      </motion.ul>
      <Button
        size={size}
        isIconOnly={isIconOnly}
        radius={radius}
        color={color}
        fullWidth={fullWidth}
        variant="shadow"
        // onMouseEnter={(e) => e.stopPropagation()}
        // onMouseLeave={(e) => e.stopPropagation()}
        onClick={() => setIsOpen((c) => !c)}
      >
        <motion.span
          variants={iconVariants}
          initial={false}
          // onMouseEnter={(e) => e.stopPropagation()}
          // onMouseLeave={(e) => e.stopPropagation()}
        >
          <FiPlus size={20} />
        </motion.span>
      </Button>
    </motion.div>
  );
}
