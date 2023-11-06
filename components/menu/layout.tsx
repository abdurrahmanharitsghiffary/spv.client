"use client";
import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useIsMd } from "@/hooks/use-media-query";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import IconButton from "../button/icon-button";

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
}: {
  items?: {
    key: string;
    label: string;
    action?: React.JSX.Element;
    icon?: React.JSX.Element;
  }[];

  onAction: (key: React.Key) => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const isMd = useIsMd();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag={isMd ? "x" : "y"}
            dragElastic={0}
            dragConstraints={
              isMd ? { right: 200, left: 0 } : { top: 0, bottom: 200 }
            }
            onDragEnd={() => onClose()}
            key="menu-layout"
            initial={
              isMd
                ? { x: 200 }
                : {
                    y: 200,
                  }
            }
            animate={
              isMd
                ? { x: 0 }
                : {
                    y: 0,
                  }
            }
            transition={{
              duration: 0.2,
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
             shadow-large bg-default-50 dark:bg-zinc-950 max-w-lg rounded-t-3xl bottom-0 h-fit fixed md:min-h-screen md:overflow-y-auto md:hide-scrollbar md:rounded-t-none md:max-w-sm"
            style={
              isMd
                ? { zIndex: 200, insetBlock: 0, right: 0 }
                : { zIndex: 200, left: "50%", translateX: "-50%" }
            }
          >
            {isMd ? (
              <div className="w-full justify-start items-center border-b-1 border-divider h-fit p-3">
                <IconButton onClick={() => onClose()}>
                  <BiChevronRight />
                </IconButton>
              </div>
            ) : (
              <div className="w-12 h-1 bg-divider my-2 mx-auto rounded-xl"></div>
            )}
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
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          className="fixed inset-0 z-[199] bg-opacity-0"
          onClick={() => onClose()}
        ></motion.div>
      )}
    </>
  );
}
