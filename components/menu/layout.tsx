"use client";
import React, { useCallback, useRef, useState } from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import clsx from "clsx";
import { useIsMd } from "@/hooks/use-media-query";
import { BiChevronRight } from "react-icons/bi";
import IconButton from "../button/icon-button";
import { TypographyLarge, TypographyMuted } from "../ui/typography";
import { Avatar } from "@nextui-org/react";

const getOffset = (offset: number, minus?: boolean) => {
  const MAX_OFFSET = 12;

  if (minus && offset < -MAX_OFFSET) return -MAX_OFFSET;
  if (offset > MAX_OFFSET) return MAX_OFFSET;
  return offset;
};

function IconWrapper({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const cl = clsx(
    "w-fit text-[1.375rem] h-fit p-2 flex justify-center items-center",
    className
  );

  return <div className={cl}>{children}</div>;
}

export default function MenuLayout({
  onClose,
  isOpen,
  items,
  onAction,
  title,
  description,
  avatar,
}: {
  items?: {
    key: string;
    label: string;
    action?: React.JSX.Element;
    icon?: React.JSX.Element;
  }[];
  title?: string;
  description?: string;
  onAction: (key: React.Key) => void;
  onClose: () => void;
  isOpen: boolean;
  avatar?: string;
}) {
  const isMd = useIsMd();

  const [dragInfo, setDragInfo] = useState<PanInfo>({} as PanInfo);
  const [offsetHeight, setOffsetHeight] = useState(0);
  console.log(offsetHeight, "Current offset height");
  const refCb = useCallback((node: HTMLDivElement) => {
    if (node) setOffsetHeight(node.offsetHeight);
  }, []);

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const dividedOffsetHeight = offsetHeight / 8;
    console.log(dividedOffsetHeight, "Divided OH");
    console.log("Offset Point", info.offset.y);
    if (info.offset.y > offsetHeight - dividedOffsetHeight) {
      onClose();
    }
    setDragInfo({ ...info });
  };
  // console.log(dragInfo, "Drag Info");
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refCb}
            drag={isMd ? "x" : "y"}
            dragElastic={0}
            dragSnapToOrigin
            dragConstraints={
              isMd ? { right: 200, left: 0 } : { top: 0, bottom: 200 }
            }
            // onDragEnd={(e, info) => setDragInfo({} as any)}
            key="menu-layout"
            initial={
              isMd
                ? { x: 200 }
                : {
                    y: 200,
                  }
            }
            onDrag={handleDrag}
            animate={
              isMd
                ? { x: 0 }
                : {
                    y: 0,
                  }
            }
            transition={{
              velocity: -100,
              duration: 0.1,
              ease: "easeIn",
            }}
            exit={
              isMd
                ? { x: 200 }
                : {
                    y: 200,
                  }
            }
            className="w-full
             shadow-large bg-default-50 dark:bg-zinc-950 max-w-lg rounded-t-3xl bottom-0 h-fit fixed md:min-h-[100dvh] md:overflow-y-auto md:hide-scrollbar md:rounded-t-none md:max-w-sm"
            style={
              isMd
                ? { zIndex: 201, insetBlock: 0, right: 0 }
                : { zIndex: 201, left: "50%", translateX: "-50%" }
            }
          >
            {isMd ? (
              <div className="w-full justify-start items-center border-b-1 border-divider h-fit p-3">
                <IconButton onClick={() => onClose()}>
                  <BiChevronRight />
                </IconButton>
              </div>
            ) : (
              <div className="w-12 h-1 my-3 mx-auto rounded-xl flex">
                <motion.span
                  style={{ scaleX: 1.052 }}
                  animate={{
                    rotate: getOffset(dragInfo?.velocity?.y / 2, true),
                    borderBottomRightRadius: 12,
                    transition: {
                      duration: 0.1,
                      ease: "linear",
                    },
                  }}
                  className="origin-top-left w-[50%] block h-full bg-default rounded-l-xl"
                ></motion.span>
                <motion.span
                  style={{ scaleX: 1.052 }}
                  animate={{
                    borderBottomLeftRadius: 12,
                    rotate: getOffset(-dragInfo?.velocity?.y / 2, true),
                    transition: {
                      ease: "linear",
                      duration: 0.1,
                    },
                  }}
                  className="w-[50%] origin-top-right block h-full bg-default rounded-r-xl"
                ></motion.span>
              </div>
            )}
            <div className="flex items-center gap-3 px-4 py-2">
              {avatar !== undefined && (
                <Avatar
                  src={avatar ?? ""}
                  name={description ?? ""}
                  showFallback
                />
              )}
              <div className="flex flex-col gap-1 justify-center items-start">
                {title && (
                  <TypographyLarge className="!text-base">
                    {title}
                  </TypographyLarge>
                )}
                {description && (
                  <TypographyMuted className="!text-sm">
                    {description}
                  </TypographyMuted>
                )}
              </div>
            </div>
            <Listbox
              aria-label="menu"
              items={items}
              className="w-full"
              variant="flat"
              onAction={(key) => {
                onAction(key);
              }}
            >
              {(item) => (
                <ListboxItem
                  key={item.key}
                  aria-label={item.label}
                  color={item.key.includes("delete") ? "danger" : "default"}
                  startContent={
                    <IconWrapper
                      className={
                        item.key.includes("delete") ? "text-danger" : ""
                      }
                    >
                      {item.icon}
                    </IconWrapper>
                  }
                  className="text-lg relative"
                >
                  <p
                    className={`${
                      item.key.includes("delete") ? "text-danger" : ""
                    } font-semibold`}
                  >
                    {item.label}
                  </p>
                  {item?.action && item?.action}
                </ListboxItem>
              )}
            </Listbox>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-opacity-0"
          onClick={() => onClose()}
        ></div>
      )}
    </>
  );
}
