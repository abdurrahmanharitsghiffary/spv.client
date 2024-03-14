"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { items } from "./bar-items";
import { useIsSSR } from "@react-aria/ssr";
import { useIsLg, useIsMd } from "@/hooks/use-media-query";
import clsx from "clsx";
import IconButton from "../button/icon-button";
import { FiChevronRight } from "react-icons/fi";
import { useIsMounted } from "@/hooks/use-is-mounted";

export default function BottomBar() {
  const pathname = usePathname();
  const isSSR = useIsSSR();
  const isMd = useIsMd();
  const isLg = useIsLg();
  const [isOpen, setIsOpen] = useState(isLg);

  const isMounted = useIsMounted();

  useEffect(() => {
    setIsOpen(isLg);
  }, [isLg]);

  const handleToggle = () => {
    setIsOpen((c) => !c);
  };

  if (!isMounted) return null;

  return (
    <Card
      isBlurred
      className={clsx(
        isOpen ? "md:w-fit" : "md:w-[53px]",
        "fixed shadow-none rounded-none left-0 right-0 bottom-0 z-[39] md:top-[64px] md:bottom-0 transition-all md:left-0 md:border-r-1 md:border-divider md:right-auto"
      )}
    >
      <Divider className="md:hidden" />
      <CardBody className="p-0 h-12 md:overflow-hidden">
        <ul className="flex justify-around w-full h-full items-center md:flex-col md:justify-start md:items-start md:gap-2">
          {items.map((item) => (
            <li
              key={item.url}
              className={clsx(
                !isOpen && "md:w-fit",
                "w-full h-full block relative md:h-fit hover:bg-default/30 transition-all"
              )}
            >
              <Link
                className="flex text-[1.25rem] justify-center flex-col md:flex-row md:gap-4 gap-1 items-center text-center h-full w-full md:p-4 md:justify-start"
                href={item.url}
              >
                {pathname === item.url ? item.active : item.icon}
                <span
                  className={clsx(
                    "text-base hidden md:inline",
                    item.url === pathname && "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
              <AnimatePresence>
                {pathname === item.url && !isSSR ? (
                  <motion.span
                    layoutId="btm_bar_active_bar"
                    animate={isMd ? { left: 0 } : { bottom: 0 }}
                    className="md:left-0 absolute bottom-0 block mx-auto md:my-auto md:inset-y-0 inset-x-0 max-w-[100px] bg-primary rounded-[30px] p-[1.5px] md:inset-x-auto"
                  ></motion.span>
                ) : null}
              </AnimatePresence>
            </li>
          ))}
          <li
            className={clsx(
              isOpen ? "ml-auto mr-2" : "mx-auto",
              "hidden md:flex justify-self-end self-end mt-auto mb-2"
            )}
          >
            <IconButton
              onClick={handleToggle}
              variant="flat"
              color="primary"
              radius="md"
              size="sm"
            >
              <FiChevronRight
                className={clsx(
                  isOpen ? "-rotate-180" : "rotate-0",
                  "transition-transform"
                )}
              />
            </IconButton>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}
